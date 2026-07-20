import { AprendizadoContent } from '@/components/dashboard/AprendizadoContent';
import { TRILHAS_PROF } from '@/lib/trilhas-data';

export default function Page() {
  return (
    <AprendizadoContent
      title="Sua formação"
      trilhas={TRILHAS_PROF}
      basePath="/educador"
      moduloPrefix="prof-"
    />
  );
}
