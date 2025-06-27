import { supabase } from './supabase';

export const saveUserProfile = async ({
  id,
  name,
  role = 'employee',
  department,
  location,
  interests,
}: {
  id: string;
  name: string;
  role?: string;
  department: string;
  location: string;
  interests: string[];
}) => {
  const { data, error } = await supabase
    .from('users')
    .upsert(
      [
        {
          id: id,
          name,
          role,
          department,
          location,
          interests,
          profileCompleted: true,
        },
      ],
      { onConflict: 'id' }
    );

  if (error) throw error;
  return data;
};
