import useSWR from 'swr';
import { LeadsResponse } from '@/types/lead';
import { authenticatedFetcher, getAuthHeaders } from '@/lib/fetch-utils';

const WEBHOOK_URL = 'https://api.integration.app/webhooks/app-events/3b76ec93-84b1-4e26-97c1-f9e4999dc107';

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

  const updateLead = async (leadData: any): Promise<void> => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      // Refresh the leads list
      await mutate();
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  };

  return {
    leads: data?.leads ?? [],
    isLoading,
    isError: error,
    mutate,
    importLeads,
    updateLead,
  };
} 