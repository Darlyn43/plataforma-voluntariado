import { useState } from 'react';
import { saveAssessmentResults } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { HandHeart, ArrowLeft, ArrowRight } from 'lucide-react';

// Gallup Strengths Test Questions
const gallupQuestions = [
  {
    id: 1,
    question: "¿Cuál de estas afirmaciones describe mejor tu estilo de trabajo?",
    description: "Selecciona la opción que más se alinea con tu forma natural de abordar las tareas y proyectos.",
    options: [
      {
        text: "Me enfoco en completar tareas una por una, asegurándome de que cada detalle esté perfecto",
        description: "Prefiero la calidad sobre la cantidad y dedico tiempo a perfeccionar mi trabajo",
        strength: "execution"
      },
      {
        text: "Disfruto trabajando con otros y creando un ambiente colaborativo",
        description: "La energía del equipo me motiva y busco formas de incluir a todos",
        strength: "relationship"
      },
      {
        text: "Me gusta liderar proyectos y tomar decisiones estratégicas",
        description: "Tengo una visión clara y me siento cómodo dirigiendo a otros hacia objetivos",
        strength: "strategic"
      },
      {
        text: "Soy analítico y me gusta investigar antes de tomar decisiones",
        description: "Recopilo datos y evidencia para fundamentar mis conclusiones",
        strength: "thinking"
      }
    ]
  },
  {
    id: 2,
    question: "¿Cómo prefieres enfrentar los desafíos en el trabajo?",
    description: "Piensa en situaciones difíciles que hayas enfrentado recientemente.",
    options: [
      {
        text: "Busco patrones y conexiones que otros no ven",
        description: "Me gusta encontrar la lógica detrás de los problemas complejos",
        strength: "thinking"
      },
      {
        text: "Me apoyo en mi red de contactos y relaciones",
        description: "Creo que las mejores soluciones surgen del trabajo en equipo",
        strength: "relationship"
      },
      {
        text: "Desarrollo un plan detallado y lo ejecuto paso a paso",
        description: "Prefiero un enfoque sistemático y organizado",
        strength: "execution"
      },
      {
        text: "Pienso en el futuro y desarrollo una estrategia a largo plazo",
        description: "Me enfoco en las implicaciones futuras de las decisiones actuales",
        strength: "strategic"
      }
    ]
  },
  {
    id: 3,
    question: "¿Qué te motiva más en un proyecto de voluntariado?",
    description: "Considera qué aspectos del trabajo voluntario te resultan más energizantes.",
    options: [
      {
        text: "Ver resultados tangibles y medibles",
        description: "Me motiva saber exactamente cuánto hemos logrado",
        strength: "execution"
      },
      {
        text: "Conectar con las personas beneficiadas",
        description: "Las historias personales y el impacto humano me inspiran",
        strength: "relationship"
      },
      {
        text: "Desarrollar nuevas formas de abordar problemas sociales",
        description: "Me emociona la innovación y pensar fuera de la caja",
        strength: "strategic"
      },
      {
        text: "Entender profundamente la problemática social",
        description: "Quiero comprender las causas raíz antes de actuar",
        strength: "thinking"
      }
    ]
  },
  {
    id: 4,
    question: "¿Cómo describes tu proceso de toma de decisiones?",
    description: "Reflexiona sobre cómo abordas las decisiones importantes.",
    options: [
      {
        text: "Considero múltiples perspectivas y busco consenso",
        description: "Valoro las opiniones de otros y busco soluciones inclusivas",
        strength: "relationship"
      },
      {
        text: "Analizo datos y busco evidencia objetiva",
        description: "Confío en hechos y análisis riguroso",
        strength: "thinking"
      },
      {
        text: "Actúo rápidamente basándome en mi experiencia",
        description: "Confío en mi instinto y en lo que ha funcionado antes",
        strength: "execution"
      },
      {
        text: "Evalúo el impacto a largo plazo y las consecuencias",
        description: "Pienso en cómo la decisión afectará el futuro",
        strength: "strategic"
      }
    ]
  },
  {
    id: 5,
    question: "¿En qué tipo de ambiente de trabajo te sientes más productivo?",
    description: "Piensa en los entornos donde has dado tu mejor rendimiento.",
    options: [
      {
        text: "En un lugar tranquilo donde pueda concentrarme y reflexionar",
        description: "Necesito espacio mental para procesar información",
        strength: "thinking"
      },
      {
        text: "Rodeado de gente colaborando en proyectos conjuntos",
        description: "La energía social me ayuda a ser más creativo",
        strength: "relationship"
      },
      {
        text: "Con objetivos claros y plazos definidos",
        description: "Trabajo mejor con estructura y expectativas específicas",
        strength: "execution"
      },
      {
        text: "En situaciones que requieren visión y planificación futura",
        description: "Me motivan los proyectos que implican crear algo nuevo",
        strength: "strategic"
      }
    ]
  }
];

interface PsychologicalTestProps {
  onComplete: () => void;
}

export function PsychologicalTest({ onComplete }: PsychologicalTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / gallupQuestions.length) * 100;

  const handleAnswer = (questionId: number, option: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < gallupQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeTest();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeTest = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Process results
      const strengthCounts = {
        execution: 0,
        relationship: 0,
        strategic: 0,
        thinking: 0
      };

      Object.values(answers).forEach((answer: any) => {
        strengthCounts[answer.strength as keyof typeof strengthCounts]++;
      });

      const topStrength = Object.entries(strengthCounts)
        .sort(([,a], [,b]) => b - a)[0][0];

      const results = {
        topStrength,
        strengthDistribution: strengthCounts,
        personalityProfile: getPersonalityProfile(topStrength),
        volunteeringSuggestions: getVolunteeringSuggestions(topStrength)
      };

      await saveAssessmentResults(user.uid, 'gallup', answers, results);

      toast({
        title: "Evaluación completada",
        description: "Tus resultados han sido guardados correctamente.",
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonalityProfile = (strength: string) => {
    const profiles = {
      execution: {
        title: "Ejecutor",
        description: "Te destacas por tu capacidad de hacer que las cosas sucedan. Eres confiable, organizado y orientado a resultados.",
        traits: ["Disciplinado", "Responsable", "Orientado a resultados", "Organizado"]
      },
      relationship: {
        title: "Constructor de Relaciones",
        description: "Tu fortaleza está en conectar con otros y crear equipos sólidos. Eres empático y comunicativo.",
        traits: ["Empático", "Comunicativo", "Colaborativo", "Inspirador"]
      },
      strategic: {
        title: "Pensador Estratégico",
        description: "Ves el panorama general y puedes crear caminos hacia el futuro. Eres visionario e innovador.",
        traits: ["Visionario", "Innovador", "Planificador", "Adaptable"]
      },
      thinking: {
        title: "Analítico",
        description: "Te gusta entender el 'por qué' detrás de las cosas. Eres reflexivo y orientado a datos.",
        traits: ["Reflexivo", "Curioso", "Lógico", "Investigativo"]
      }
    };

    return profiles[strength as keyof typeof profiles];
  };

  const getVolunteeringSuggestions = (strength: string) => {
    const suggestions = {
      execution: [
        "Coordinación de eventos de voluntariado",
        "Gestión de proyectos comunitarios",
        "Organización de campañas de donación",
        "Supervisión de construcción de viviendas sociales"
      ],
      relationship: [
        "Mentoring a jóvenes en riesgo",
        "Facilitación de talleres grupales",
        "Trabajo con adultos mayores",
        "Mediación en conflictos comunitarios"
      ],
      strategic: [
        "Desarrollo de programas sociales",
        "Planificación de iniciativas de sostenibilidad",
        "Consultoría para ONGs",
        "Diseño de campañas de concientización"
      ],
      thinking: [
        "Investigación social",
        "Análisis de impacto de programas",
        "Educación y capacitación",
        "Evaluación de necesidades comunitarias"
      ]
    };

    return suggestions[strength as keyof typeof suggestions];
  };

  const currentQ = gallupQuestions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                <HandHeart className="text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Evaluación de Fortalezas</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <span className="text-sm text-gray-600">Paso 2 de 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex-1 flex items-center">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">✓</div>
              <div className="flex-1 h-1 bg-secondary mx-4"></div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
              <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">3</div>
            </div>
          </div>
          <div className="pb-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Pregunta {currentQuestion + 1} de {gallupQuestions.length} - Test de Fortalezas Gallup
            </p>
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Evaluación de Fortalezas</h2>
              <p className="text-gray-600">
                Responde honestamente para obtener las mejores recomendaciones de voluntariado
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-blue-50 border-l-4 border-primary p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {currentQ.question}
                </h3>
                <p className="text-gray-600">
                  {currentQ.description}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQ.options.map((option, index) => (
                  <label
                    key={index}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAnswer?.text === option.text
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:bg-blue-50 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="question"
                        value={option.text}
                        checked={selectedAnswer?.text === option.text}
                        onChange={() => handleAnswer(currentQ.id, option)}
                        className="h-5 w-5 text-primary focus:ring-primary border-gray-300 mt-1 mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{option.text}</p>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center px-6 py-3"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAnswer(currentQ.id, { text: "Saltar", strength: "neutral" })}
                    className="px-6 py-3"
                  >
                    Saltar
                  </Button>
                  <Button
                    type="button"
                    onClick={nextQuestion}
                    disabled={!selectedAnswer || isLoading}
                    className="flex items-center px-6 py-3 bg-primary text-white hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : currentQuestion === gallupQuestions.length - 1 ? (
                      "Finalizar"
                    ) : (
                      <>
                        Siguiente
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
