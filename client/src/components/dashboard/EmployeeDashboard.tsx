import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getVolunteerOpportunities, getUserParticipations, joinOpportunity } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { HandHeart, Clock, Heart, Award, Target, Bell, Calendar, Users, Plus, UserPlus, Share2 } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'lab' | 'mision';
  location: string;
  startDate: any;
  duration: number;
  maxVolunteers: number;
  currentVolunteers: number;
  skills: string[];
  sdgs: string[];
  match?: number;
}

export function EmployeeDashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [opps, parts] = await Promise.all([
        getVolunteerOpportunities(),
        getUserParticipations(user.uid)
      ]);

      // Add mock match percentage for demonstration
      const oppsWithMatch = opps.map(opp => ({
        ...opp,
        match: Math.floor(Math.random() * 30) + 70 // Random match 70-100%
      }));

      setOpportunities(oppsWithMatch);
      setParticipations(parts);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOpportunity = async (opportunityId: string) => {
    if (!user) return;

    try {
      await joinOpportunity(user.uid, opportunityId);
      toast({
        title: "¡Excelente!",
        description: "Te has unido al proyecto de voluntariado.",
      });
      loadData(); // Reload data
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo unir al proyecto.",
        variant: "destructive",
      });
    }
  };

  const userStats = {
    hours: participations.reduce((sum, p) => sum + (p.hoursCompleted || 0), 0) || 24,
    projects: participations.filter(p => p.status === 'completed').length || 7,
    badges: 3,
    impact: 156
  };

  const userProfile = user?.profile || {
    firstName: user?.email?.split('@')[0] || 'Usuario',
    department: 'Finanzas',
    location: 'Lima'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <HandHeart className="text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">Manuchar Perú</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="#" className="border-primary text-primary border-b-2 py-4 px-1 text-sm font-medium">
                  Inicio
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                  Oportunidades
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                  Mi Impacto
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                  Reconocimientos
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-warm rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {userProfile.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {userProfile.firstName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {userProfile.firstName}!
          </h1>
          <p className="text-lg text-gray-600">Descubre nuevas formas de generar impacto positivo en tu comunidad</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-primary text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{userStats.hours}</p>
                  <p className="text-sm text-gray-600">Horas Voluntariado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="text-secondary text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{userStats.projects}</p>
                  <p className="text-sm text-gray-600">Proyectos Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="text-warm text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{userStats.badges}</p>
                  <p className="text-sm text-gray-600">Insignias Ganadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Target className="text-red-500 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{userStats.impact}</p>
                  <p className="text-sm text-gray-600">Personas Impactadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended for You */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recomendado para ti</h2>
                  <span className="text-sm text-gray-500">Basado en tu perfil</span>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                {opportunities.slice(0, 2).map((opportunity) => (
                  <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge variant={opportunity.type === 'lab' ? 'default' : 'secondary'} className="mr-2">
                            {opportunity.type === 'lab' ? 'Lab de Voluntariado' : 'Misión Social'}
                          </Badge>
                          <span className="text-sm text-gray-500">• {opportunity.location}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span><Calendar className="inline mr-1 h-4 w-4" />15 Dic 2024</span>
                          <span><Clock className="inline mr-1 h-4 w-4" />{opportunity.duration} horas</span>
                          <span><Users className="inline mr-1 h-4 w-4" />{opportunity.currentVolunteers}/{opportunity.maxVolunteers} voluntarios</span>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-center">
                        <div className="text-2xl font-bold text-primary mb-1">{opportunity.match}%</div>
                        <div className="text-xs text-gray-500 text-center">Match</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {opportunity.sdgs.map((sdg, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            ODS {sdg}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleJoinOpportunity(opportunity.id)}
                        className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        {opportunity.type === 'lab' ? 'Unirse' : 'Aplicar'}
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Button variant="ghost" className="text-primary hover:text-blue-700">
                    Ver todas las oportunidades →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="text-secondary text-sm" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Completaste</span> el taller "Educación en Reciclaje"
                      </p>
                      <p className="text-xs text-gray-500">Hace 2 días • Ganaste +50 puntos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="text-warm text-sm" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Desbloqueaste</span> la insignia "Eco Warrior"
                      </p>
                      <p className="text-xs text-gray-500">Hace 3 días • Por completar 5 proyectos ambientales</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="text-primary text-sm" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Te uniste</span> a "Construcción de Viviendas Sociales"
                      </p>
                      <p className="text-xs text-gray-500">Hace 1 semana • Proyecto colaborativo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile & Achievements */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="h-20 w-20 bg-warm rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">
                      {userProfile.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{userProfile.firstName}</h3>
                  <p className="text-sm text-gray-600">{userProfile.department} • {userProfile.location}</p>
                  
                  {/* Progress to Next Level */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Nivel Colaborador</span>
                      <span>480/500 pts</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-warm h-2 rounded-full transition-all duration-300 w-[96%]"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">20 puntos para Nivel Líder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Logros</h2>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="text-warm" />
                    </div>
                    <p className="text-xs font-medium text-gray-900">Eco Warrior</p>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target className="text-primary" />
                    </div>
                    <p className="text-xs font-medium text-gray-900">Educator</p>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart className="text-red-500" />
                    </div>
                    <p className="text-xs font-medium text-gray-900">Helper</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
              </div>
              <CardContent className="p-6 space-y-3">
                <Button className="w-full flex items-center justify-center bg-primary text-white hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Proponer Proyecto
                </Button>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Nominar Compañero
                </Button>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir en LinkedIn
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
