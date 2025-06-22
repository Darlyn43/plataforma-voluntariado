import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserProfile } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { HandHeart } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  department: z.string().min(1, 'Selecciona tu departamento'),
  location: z.string().min(1, 'Selecciona tu ubicación'),
  interests: z.array(z.string()).min(1, 'Selecciona al menos un interés'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const departments = [
  { value: 'rrhh', label: 'Recursos Humanos' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'operaciones', label: 'Operaciones' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'ti', label: 'Tecnología de la Información' },
];

const locations = [
  { value: 'lima', label: 'Lima' },
  { value: 'arequipa', label: 'Arequipa' },
  { value: 'trujillo', label: 'Trujillo' },
  { value: 'cusco', label: 'Cusco' },
];

const interests = [
  { value: 'educacion', label: 'Educación' },
  { value: 'medio-ambiente', label: 'Medio Ambiente' },
  { value: 'salud', label: 'Salud' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'comunidad', label: 'Comunidad' },
  { value: 'arte-cultura', label: 'Arte y Cultura' },
];

interface ProfileFormProps {
  onComplete: () => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      department: '',
      location: '',
      interests: [],
    },
  });

  const handleInterestChange = (interestValue: string, checked: boolean) => {
    const newInterests = checked
      ? [...selectedInterests, interestValue]
      : selectedInterests.filter(i => i !== interestValue);
    
    setSelectedInterests(newInterests);
    form.setValue('interests', newInterests);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await createUserProfile(user.uid, {
        ...data,
        email: user.email,
        firebaseUid: user.uid,
        role: 'employee',
      });

      toast({
        title: "Perfil completado",
        description: "Tu perfil se ha guardado correctamente.",
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar tu perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <span className="text-xl font-semibold text-gray-900">Manuchar Perú</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <span className="text-sm text-gray-600">Paso 1 de 3</span>
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
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
              <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">2</div>
              <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Bienvenido a tu plataforma de voluntariado!</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Vamos a conocerte mejor para conectarte con las oportunidades de voluntariado más adecuadas para ti.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Nombre</Label>
                  <Input
                    {...form.register('firstName')}
                    placeholder="Tu nombre"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Apellido</Label>
                  <Input
                    {...form.register('lastName')}
                    placeholder="Tu apellido"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Departamento</Label>
                <Select onValueChange={(value) => form.setValue('department', value)}>
                  <SelectTrigger className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <SelectValue placeholder="Selecciona tu departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.department && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.department.message}</p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</Label>
                <Select onValueChange={(value) => form.setValue('location', value)}>
                  <SelectTrigger className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <SelectValue placeholder="Selecciona tu ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.location && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.location.message}</p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Intereses de Voluntariado</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {interests.map((interest) => (
                    <label
                      key={interest.value}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-3"
                        onCheckedChange={(checked) => handleInterestChange(interest.value, checked as boolean)}
                      />
                      <span className="text-sm text-gray-700">{interest.label}</span>
                    </label>
                  ))}
                </div>
                {form.formState.errors.interests && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.interests.message}</p>
                )}
              </div>

              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" className="px-6 py-3">
                  Atrás
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-primary text-white hover:bg-blue-700"
                >
                  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Continuar a las Evaluaciones
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
