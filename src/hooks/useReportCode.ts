import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserContext } from '@/types/discount';
import { Json } from '@/integrations/supabase/types';

interface ReportCodeParams {
  codeId: string;
  worked: boolean;
  userContext?: UserContext;
}

export function useReportCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ codeId, worked, userContext }: ReportCodeParams) => {
      const { error } = await supabase.from('code_reports').insert([
        {
          code_id: codeId,
          worked,
          user_context: userContext ? (JSON.parse(JSON.stringify(userContext)) as Json) : null,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate stores query to refresh data
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
}
