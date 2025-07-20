import { useState, useEffect } from 'react';
import { campaignService } from '@/services/campaignService';
import { CampaignSummary, Campaign } from '@/types/campaign';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await campaignService.getCampaigns();
      setCampaigns(response.campanas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar campañas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns
  };
};

export const useCampaign = (campaignId: string | null) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await campaignService.getCampaign(id);
      setCampaign(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar campaña');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchCampaign(campaignId);
    }
  }, [campaignId]);

  return {
    campaign,
    loading,
    error,
    refetch: campaignId ? () => fetchCampaign(campaignId) : undefined
  };
};
