import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart, Award, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await login();
      
      if (result.success) {
        toast({
          title: "Acceso  Exitoso",
          description: result.message,
        });
        // Redirect to  dashboard
        window.location.href = "/-dashboard";
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo acceder al perfil ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manuchar Perú Voluntariado
          </h1>
          <p className="text-xl text-gray-600">
            Conectando talento con propósito social
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/*  Profile Card */}
          <Card className="bg-white shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Perfil </CardTitle>
              <CardDescription className="text-blue-100">
                Explora la plataforma con un perfil completo
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">María García</p>
                    <p className="text-sm text-gray-600">Recursos Humanos</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold">Evaluación Completada</p>
                    <p className="text-sm text-gray-600">Fortaleza principal: Comunicación</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold">1 Participación</p>
                    <p className="text-sm text-gray-600">Taller de educación financiera</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold">4 Horas Voluntariado</p>
                    <p className="text-sm text-gray-600">Badge "Helper" obtenido</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {isLoading ? "Accediendo..." : "Acceder como María García"}
              </Button>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                ¿Qué puedes explorar?
              </CardTitle>
              <CardDescription>
                Con el perfil  tendrás acceso completo a:
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Dashboard Personalizado</p>
                    <p className="text-sm text-gray-600">Ve oportunidades recomendadas basadas en tu perfil psicológico</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Resultados de Evaluación</p>
                    <p className="text-sm text-gray-600">Revisa tu perfil de fortalezas Gallup y recomendaciones</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Oportunidades de Voluntariado</p>
                    <p className="text-sm text-gray-600">Explora proyectos de educación, medio ambiente y desarrollo</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Sistema de Badges</p>
                    <p className="text-sm text-gray-600">Ve tus logros y progreso en voluntariado</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Historial de Participación</p>
                    <p className="text-sm text-gray-600">Revisa tus contribuciones pasadas y feedback</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Este es un perfil de stración con datos reales 
                  para que puedas explorar todas las funcionalidades de la plataforma.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            ¿Tienes una cuenta real? <a href="/login" className="text-blue-600 hover:underline">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}