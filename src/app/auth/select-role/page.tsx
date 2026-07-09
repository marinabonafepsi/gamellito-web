'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SelectRolePage() {
  const router = useRouter();

  const roles = [
    {
      id: 'familia',
      label: 'Família & DM1',
      description:
        'Trilhas de aprendizado, diário de glicemia e conquistas para pais, crianças e adolescentes.',
      art: '/assets/gamellito-e-amigos.svg',
      artBg: '#FFE1EE',
      dots: ['var(--game-pink)', 'var(--color-sun)'],
      cta: 'Entrar como família',
    },
    {
      id: 'profissional',
      label: 'Sou da Saúde',
      description:
        'Método validado, materiais clínicos, grupos de pacientes e submissão de artigos.',
      art: '/assets/medico-mae-gamellito.svg',
      artBg: '#DDEBFF',
      dots: ['var(--game-blue)', 'var(--game-green)'],
      cta: 'Entrar como saúde',
    },
    {
      id: 'educador',
      label: 'Sou Educador',
      description:
        'Formação, atividades para a turma e acompanhamento de alunos com DM1.',
      art: '/assets/gamellito-adventures.svg',
      artBg: '#E4F5D0',
      dots: ['var(--game-green)', 'var(--color-orange)'],
      cta: 'Entrar como educador',
    },
    {
      id: 'instituicao',
      label: 'Sou de uma Instituição',
      description:
        'Gerencie sua escola ou clínica e implemente o método Gamellito com sua equipe.',
      art: '/assets/gamellito-contente.svg',
      artBg: '#FFF3C9',
      dots: ['var(--color-sun)', 'var(--game-magenta)'],
      cta: 'Entrar como instituição',
    },
  ];

  const handleSelectRole = (roleId: string) => {
    router.push(`/auth/signup/${roleId}`);
  };

  return (
    <div className="role-stage" style={{ backgroundColor: 'var(--color-sun)' }}>
      <div className="top">
        <p className="eyebrow">&nbsp;</p>
        <h1>
          Bem-vindo ao mundo do&nbsp;
          <span style={{ color: 'var(--color-purple)' }}>Gamellito&nbsp;</span>!
        </h1>
        <p className="sub">Escolha seu perfil para continuar</p>
      </div>

      <div className="cards">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            className="rcard"
            onClick={() => handleSelectRole(role.id)}
            data-test={`btn-role-${role.id}`}
          >
            <span className="rdots">
              <span style={{ background: role.dots[0] }} />
              <span style={{ background: role.dots[1] }} />
            </span>
            <span className="rart" style={{ background: role.artBg }}>
              <Image src={role.art} alt="" width={96} height={96} />
            </span>
            <div className="rbody">
              <h3>{role.label}</h3>
              <p>{role.description}</p>
              <span className="rgo">
                {role.cta} <span className="arrow">→</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="role-foot">
        Já tem conta?{' '}
        <Link href="/auth/login" style={{ color: 'var(--accent-hover)' }}>
          Fazer login
        </Link>
      </p>
    </div>
  );
}
