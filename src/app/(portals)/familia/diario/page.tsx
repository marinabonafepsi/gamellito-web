'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DiarioRedirectPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [error, setError] = useState(false);

  useEffect(() => {
    const go = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const { data: crianca } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (crianca) {
        router.replace(`/familia/crianca/${crianca.user_id}/registros`);
      } else {
        setError(true);
      }
    };
    go();
  }, [router, supabase]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      {error ? (
        <p className="text-ink/60 font-body">
          Não encontramos um diário associado à sua conta ainda.
        </p>
      ) : (
        <p className="text-ink/60 font-body">Abrindo seu diário...</p>
      )}
    </div>
  );
}
