import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange, getUserProfile } from '@/lib/firebase';

interface AuthUser {
  uid: string;
  email: string;
  profile?: any;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          profile,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
