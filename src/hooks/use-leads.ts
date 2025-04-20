import useSWR from 'swr';
import { LeadsResponse } from '@/types/lead';
import { authenticatedFetcher, getAuthHeaders } from '@/lib/fetch-utils';

export function useLeads() {
  const { data, error, isLoading, mutate } = useSWR<LeadsResponse>(
    '/api/leads',
    (url) => authenticatedFetcher<LeadsResponse>(url),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const importLeads = async () => {
    try {
      const response = await fetch('/api/leads/import', {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to import leads');
      }

      // Refresh the leads list
      await mutate();

      return true;
    } catch (error) {
      console.error('Error importing leads:', error);
      throw error;
    }
  };

  return {
    leads: data?.leads ?? [],
    isLoading,
    isError: error,
    mutate,
    importLeads,
  };
} 