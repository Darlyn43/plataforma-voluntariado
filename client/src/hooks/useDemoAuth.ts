import { useState, useEffect } from 'react';

interface User {
  id: number;
  id: string;
  email: string;
  profile: any;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is in  mode
    const User = localStorage.getItem('User');
    if (User) {
      setUser(JSON.parse(User));
    }
    setLoading(false);
  }, []);

  const login = async () => {
    try {
      const response = await fetch("/api/auth/-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const User = {
          id: data.user.id,
          id: data.user.firebaseUid,
          email: data.user.email,
          profile: data.user
        };
        
        localStorage.setItem('User', JSON.stringify(User));
        setUser(User);
        return { success: true, message: data.message };
      } else {
        throw new Error("Error en el acceso ");
      }
    } catch (error) {
      return { success: false, error: "No se pudo acceder al perfil " };
    }
  };

  const logout = () => {
    localStorage.removeItem('User');
    setUser(null);
  };

  return { user, loading, login, logout };
};