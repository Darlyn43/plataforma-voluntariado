import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HandHeart, Users, Clock, Target, Heart, TrendingUp, Award } from 'lucide-react';

interface AdminStats {
  activeVolunteers: number;
  totalHours: number;
  activeProjects: number;
  peopleImpacted: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    activeVolunteers: 347,
    totalHours: 1247,
    activeProjects: 23,
    peopleImpacted: 4832
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const departmentData = [
    { name: 'Recursos Humanos', percentage: 85, color: 'bg-primary' },
    { name: 'Marketing', percentage: 72, color: 'bg-secondary' },
    { name: 'Finanzas', percentage: 68, color: 'bg-warm' },
    { name: 'Operaciones', percentage: 54, color: 'bg-red-500' },
    { name: 'Tecnología', percentage: 49, color: 'bg-purple-500' },
  ];

  const sdgData = [
    { number: 4, title: 'Educación', impact: 847, color: 'bg-blue-50 text-primary' },
    { number: 8, title: 'Trabajo', impact: 623, color: 'bg-green-50 text-secondary' },
    { number: 3, title: 'Salud', impact: 412, color: 'bg-yellow-50 text-warm' },
    { number: 17, title: 'Alianzas', impact: 298, color: 'bg-purple-50 text-purple-600' },
  ];

  const recentProjects = [
    {
      title: 'Reforestación Urbana',
      volunteers: 23,
      location: 'Lima',
      status: 'Completado',
      hours: 92,
      sdg: '15',
      impact: '127 árboles plantados',
      icon: '🌱'
    },
    {
      title: 'Talleres de Programación',
      volunteers: 12,
      location: 'Remoto',
      status: 'En progreso',
      hours: 68,
      sdg: '4',
      impact: '45 estudiantes beneficiados',
      icon: '💻'
    }
  ];

  const topVolunteers = [
    { name: 'Carlos Andrade', department: 'Finanzas', hours: 47, badges: 5, rank: 1 },
    { name: 'María Ángeles', department: 'Marketing', hours: 41, badges: 4, rank: 2 },
    { name: 'Luis Pérez', department: 'Operaciones', hours: 38, badges: 3, rank: 3 },
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-warm text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-orange-500 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

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
                <span className="text-xl font-semibold text-gray-900">Manuchar Perú - Admin</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="#" className="border-primary text-primary border-b-2 py-4 px-1 text-sm font-medium">
                  Dashboard
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                  Empleados
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                  Proyectos
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-4 px-1 text-sm font-medium">
                  Reportes
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AC</span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">Ana Coordinadora</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-lg text-gray-600">Gestiona y monitorea el programa de voluntariado corporativo</p>
          
          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Select defaultValue="all-locations">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">Todas las ubicaciones</SelectItem>
                <SelectItem value="lima">Lima</SelectItem>
                <SelectItem value="arequipa">Arequipa</SelectItem>
                <SelectItem value="trujillo">Trujillo</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-departments">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-departments">Todos los departamentos</SelectItem>
                <SelectItem value="finanzas">Finanzas</SelectItem>
                <SelectItem value="operaciones">Operaciones</SelectItem>
                <SelectItem value="rrhh">Recursos Humanos</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="last-month">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-month">Último mes</SelectItem>
                <SelectItem value="last-quarter">Último trimestre</SelectItem>
                <SelectItem value="last-year">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-primary text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.activeVolunteers}</p>
                  <p className="text-sm text-gray-600">Voluntarios Activos</p>
                  <p className="text-xs text-green-600">+12% este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-secondary text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
                  <p className="text-sm text-gray-600">Horas Totales</p>
                  <p className="text-xs text-green-600">+8% este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="text-warm text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                  <p className="text-sm text-gray-600">Proyectos Activos</p>
                  <p className="text-xs text-blue-600">5 nuevos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="text-red-500 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.peopleImpacted}</p>
                  <p className="text-sm text-gray-600">Personas Impactadas</p>
                  <p className="text-xs text-green-600">+23% este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Participation by Department */}
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Participación por Departamento</h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className={`${dept.color} h-2 rounded-full`} style={{ width: `${dept.percentage}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{dept.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SDG Impact */}
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Impacto por ODS</h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {sdgData.map((sdg, index) => (
                  <div key={index} className={`text-center p-4 ${sdg.color} rounded-lg`}>
                    <div className="text-2xl font-bold">{sdg.impact}</div>
                    <div className="text-sm">ODS {sdg.number}: {sdg.title}</div>
                    <div className="text-xs opacity-75">Personas impactadas</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects and Top Volunteers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Proyectos Recientes</h2>
                <Button variant="ghost" className="text-sm text-primary hover:text-blue-700">Ver todos</Button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl">{project.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.volunteers} voluntarios • {project.location} • {project.status}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="bg-green-100 text-secondary text-xs font-medium px-2 py-1 rounded-full">ODS {project.sdg}</span>
                        <span className="text-xs text-gray-500">{project.impact}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{project.hours} hrs</div>
                      <div className="text-xs text-gray-500">total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Volunteers */}
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Voluntarios Destacados</h2>
                <Button variant="ghost" className="text-sm text-primary hover:text-blue-700">Ver ranking</Button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topVolunteers.map((volunteer, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankColor(volunteer.rank)}`}>
                      <span>{volunteer.rank}</span>
                    </div>
                    <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {volunteer.name.split(' ').map(n => n.charAt(0)).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{volunteer.name}</p>
                      <p className="text-sm text-gray-600">{volunteer.department} • {volunteer.hours} horas este mes</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Award className="text-warm text-sm" />
                        <span className="text-sm font-medium text-gray-900">{volunteer.badges}</span>
                      </div>
                      <p className="text-xs text-gray-500">insignias</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
