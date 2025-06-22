import { useState, useEffect } from 'react';

interface DemoUser {
  id: number;
  uid: string;
  email: string;
  profile: any;
}

export const useDemoAuth = () => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is in demo mode
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
    }
    setLoading(false);
  }, []);

  const loginDemo = async () => {
    try {
      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const demoUser = {
          id: data.user.id,
          uid: data.user.firebaseUid,
          email: data.user.email,
          profile: data.user
        };
        
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        setUser(demoUser);
        return { success: true, message: data.message };
      } else {
        throw new Error("Error en el acceso demo");
      }
    } catch (error) {
      return { success: false, error: "No se pudo acceder al perfil demo" };
    }
  };

  const logoutDemo = () => {
    localStorage.removeItem('demoUser');
    setUser(null);
  };

  return { user, loading, loginDemo, logoutDemo };
};