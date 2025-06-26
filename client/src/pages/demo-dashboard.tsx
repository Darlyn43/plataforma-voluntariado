import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Award, 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  ArrowLeft 
} from "lucide-react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  location: string;
  interests: string[];
}

interface Assessment {
  topStrength: string;
  personalityProfile: {
    empathy: number;
    strategic: number;
    communication: number;
    responsibility: number;
    achiever: number;
  };
  recommendations: string[];
}

interface Opportunity {
  id: number;
  title: string;
  description: string;
  type: string;
  location: string;
  duration: number;
  skills: string[];
  sdgs: string[];
  matchPercentage: number;
}

export default function DashboardPage() {
  const [user] = useState<User>({
    id: 1,
    firstName: "María",
    lastName: "García",
    email: "maria.garcia@manuchar.com",
    department: "Recursos Humanos",
    location: "Lima",
    interests: ["educación", "medio ambiente", "desarrollo comunitario"]
  });

  const [assessment] = useState<Assessment>({
    topStrength: "Communication",
    personalityProfile: {
      empathy: 5,
      strategic: 4,
      communication: 5,
      responsibility: 4,
      achiever: 4
    },
    recommendations: [
      "Tu fortaleza en comunicación te hace ideal para proyectos educativos",
      "Usa tu empatía para conectar con comunidades vulnerables",
      "Tu pensamiento estratégico puede ayudar en planificación de proyectos"
    ]
  });

  const [opportunities] = useState<Opportunity[]>([
    {
      id: 1,
      title: "Taller de Alfabetización Digital",
      description: "Enseña habilidades básicas de computación y uso de internet a adultos mayores en centros comunitarios.",
      type: "lab",
      location: "San Juan de Miraflores",
      duration: 6,
      skills: ["comunicación", "paciencia", "conocimientos informáticos"],
      sdgs: ["4", "8", "10"],
      matchPercentage: 92
    },
    {
      id: 2,
      title: "Campaña de Salud Preventiva",
      description: "Apoya en jornadas médicas gratuitas proporcionando información sobre prevención de enfermedades.",
      type: "mision",
      location: "Ate",
      duration: 8,
      skills: ["comunicación", "empatía", "organización"],
      sdgs: ["3", "1", "10"],
      matchPercentage: 88
    },
    {
      id: 3,
      title: "Reforestación en Villa El Salvador",
      description: "Participa en la plantación de árboles nativos para combatir el cambio climático.",
      type: "mision",
      location: "Villa El Salvador",
      duration: 4,
      skills: ["trabajo en equipo", "resistencia física"],
      sdgs: ["15", "13", "11"],
      matchPercentage: 75
    }
  ]);

  const getSDGColor = (sdg: string) => {
    const colors: { [key: string]: string } = {
      "1": "bg-red-500",
      "3": "bg-green-500", 
      "4": "bg-blue-500",
      "8": "bg-purple-500",
      "10": "bg-pink-500",
      "11": "bg-orange-500",
      "13": "bg-teal-500",
      "15": "bg-emerald-500"
    };
    return colors[sdg] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/*  Header */}
      <div className="bg-blue-600 text-white p-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-800 px-2 py-1 rounded text-sm font-medium"></span>
            <span>Perfil de stración - María García</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => window.location.href = "/login"}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Login
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {user.firstName}!
          </h1>
          <p className="text-gray-600">
            Bienvenida a tu dashboard de voluntariado corporativo de Manuchar Perú
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Mi Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-600">{user.department}</p>
                <p className="text-sm text-gray-600">{user.location}</p>
              </div>
              
              <div>
                <p className="font-semibold text-sm mb-2">Fortaleza Principal</p>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {assessment.topStrength}
                </Badge>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">Perfil de Fortalezas</p>
                <div className="space-y-2">
                  {Object.entries(assessment.personalityProfile).map(([strength, score]) => (
                    <div key={strength} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{strength}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={score * 20} className="w-16 h-2" />
                        <span className="text-sm text-gray-600">{score}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">Mi Impacto</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-bold text-blue-600">1</div>
                    <div className="text-gray-600">Proyectos</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-bold text-green-600">4</div>
                    <div className="text-gray-600">Horas</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Oportunidades Recomendadas para Ti</span>
                </CardTitle>
                <CardDescription>
                  Basadas en tu perfil psicológico y preferencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{opp.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{opp.description}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-green-600">
                            {opp.matchPercentage}% match
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{opp.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{opp.duration} horas</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{opp.type === 'lab' ? 'Laboratorio' : 'Misión'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {opp.sdgs.map((sdg) => (
                            <div
                              key={sdg}
                              className={`w-6 h-6 rounded text-white text-xs font-bold flex items-center justify-center ${getSDGColor(sdg)}`}
                            >
                              {sdg}
                            </div>
                          ))}
                        </div>
                        <Button size="sm">
                          Postularme
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>Recomendaciones Personalizadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessment.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}