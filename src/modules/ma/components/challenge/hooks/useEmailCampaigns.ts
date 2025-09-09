import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brevoService } from '../services/brevo-service';
import type { EmailCampaign, CampaignAnalytics } from '../types/email.types';

export const useEmailCampaigns = () => {
  return useQuery({
    queryKey: ['email-campaigns'],
    queryFn: () => brevoService.getCampaigns(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaign: Omit<EmailCampaign, 'id' | 'analytics' | 'createdAt' | 'updatedAt'>) =>
      brevoService.createCampaign(campaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
    },
  });
};

export const useCampaignAnalytics = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-analytics', campaignId],
    queryFn: () => brevoService.getCampaignAnalytics(campaignId),
    enabled: !!campaignId,
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
};

export const useAllCampaignAnalytics = () => {
  const { data: campaigns } = useEmailCampaigns();

  return useQuery({
    queryKey: ['all-campaign-analytics'],
    queryFn: async () => {
      if (!campaigns) return [];
      
      const analyticsPromises = campaigns.map(campaign =>
        brevoService.getCampaignAnalytics(campaign.id)
      );
      
      return Promise.all(analyticsPromises);
    },
    enabled: !!campaigns && campaigns.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};