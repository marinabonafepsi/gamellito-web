'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';
import { ROLE_LABEL, type Role } from '@/lib/auth-roles';

export default function SignupPage() {
  const params = useParams();
  const role = params.role as Role;

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="h-md text-purple mb-2">Criar Conta</h1>
          <p className="text-ink/60">{ROLE_LABEL[role] || role}</p>
        </div>

        <SignupForm role={role} />

        <div className="text-center mt-6">
          <p className="text-ink/60 text-sm">
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="text-purple-main hover:underline font-medium">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
