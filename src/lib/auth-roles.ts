export type Role = 'familia' | 'dm1' | 'educador' | 'profissional' | 'instituicao';

export const DASHBOARD_BY_ROLE: Record<Role, string> = {
  familia: '/familia/dashboard',
  dm1: '/familia/dashboard',
  profissional: '/profissional/dashboard',
  educador: '/educador/dashboard',
  instituicao: '/instituicao/dashboard',
};

// Rótulo curto usado em títulos/cabeçalhos (ex.: "Criar Conta — Sou Pai/Responsável")
export const ROLE_LABEL: Record<Role, string> = {
  familia: 'Sou Pai/Responsável',
  dm1: 'Sou Pessoa com DM1',
  educador: 'Sou Professor',
  profissional: 'Sou Profissional de Saúde',
  instituicao: 'Sou de uma Instituição',
};

// Dados completos pra tela de seleção de perfil dentro da AuthModal (lista
// compacta). A página pública /auth/select-role usa seu próprio layout de
// cards ilustrados e não inclui o papel "dm1" — só a AuthModal oferece
// cadastro direto como pessoa com DM1 hoje.
export const SIGNUP_ROLES: {
  id: Role;
  label: string;
  icon: string;
  description: string;
  color: string;
  dot: string;
}[] = [
  {
    id: 'familia',
    label: ROLE_LABEL.familia,
    icon: '👨‍👩‍👧',
    description: 'Acompanhe a saúde do seu filho',
    color: 'bg-orange',
    dot: 'bg-game-pink',
  },
  {
    id: 'dm1',
    label: ROLE_LABEL.dm1,
    icon: '🧑',
    description: 'Acompanhe sua própria saúde',
    color: 'bg-game-blue',
    dot: 'bg-game-pink',
  },
  {
    id: 'educador',
    label: ROLE_LABEL.educador,
    icon: '👨‍🏫',
    description: 'Compartilhe recursos com alunos',
    color: 'bg-lilac',
    dot: 'bg-game-green',
  },
  {
    id: 'profissional',
    label: ROLE_LABEL.profissional,
    icon: '👨‍⚕️',
    description: 'Acesse dados de seus pacientes',
    color: 'bg-purple-soft',
    dot: 'bg-game-blue',
  },
  {
    id: 'instituicao',
    label: ROLE_LABEL.instituicao,
    icon: '🏫',
    description: 'Gerencie sua escola/clínica',
    color: 'bg-cream',
    dot: 'bg-sun',
  },
];
