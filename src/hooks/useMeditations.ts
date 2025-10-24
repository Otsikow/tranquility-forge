/**
 * Hook for managing meditations library
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Meditation } from '@/types/db';

export function useMeditations() {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const { data, error } = await supabase
          .from('meditations')
          .select('id, title, description, duration_seconds, cover_url, audio_url, is_free, created_at, categories, tags, level')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setMeditations(data);
      } catch (error) {
        console.error('Error fetching meditations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeditations();
  }, []);

  return { meditations, loading };
}
