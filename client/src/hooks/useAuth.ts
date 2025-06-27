import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  profile?: any;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios de sesion (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;

      if (currentUser) {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        setUser({
          id: currentUser.id,
          email: currentUser.email!,
          profile: profile || {},
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    // Al cargar la app: revisar si ya hay un usuario logueado
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;

      if (currentUser) {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        setUser({
          id: currentUser.id,
          email: currentUser.email!,
          profile: profile || {},
        });
      }
      setLoading(false);
    };

    init();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
