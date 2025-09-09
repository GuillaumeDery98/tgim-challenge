import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brevoService } from '../services/brevo-service';
import type { EmailTemplate } from '../types/email.types';

export const useEmailTemplates = () => {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: () => brevoService.getEmailTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) =>
      brevoService.createEmailTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EmailTemplate> }) =>
      brevoService.updateEmailTemplate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => brevoService.deleteEmailTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });
};