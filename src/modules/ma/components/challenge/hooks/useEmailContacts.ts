import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brevoService } from '../services/secure-brevo-service';
import type { EmailContact, BounceRecord } from '../types/email.types';

export const useEmailContacts = (limit = 50, offset = 0) => {
  return useQuery({
    queryKey: ['email-contacts', limit, offset],
    queryFn: () => brevoService.getContacts(limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: {
      email: string;
      attributes?: Record<string, any>;
      listIds?: number[];
    }) => brevoService.createContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-contacts'] });
    },
  });
};

export const useBounces = (campaignId?: string) => {
  return useQuery({
    queryKey: ['bounces', campaignId],
    queryFn: () => brevoService.getBounces(campaignId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCleanupBounces = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bounceIds: string[]) => brevoService.cleanupBounces(bounceIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bounces'] });
      queryClient.invalidateQueries({ queryKey: ['email-contacts'] });
    },
  });
};