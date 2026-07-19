import { AprendizadoContent } from '@/components/dashboard/AprendizadoContent';
import { TRILHAS_SAUDE } from '@/lib/trilhas-data';

export default function Page() {
  return <AprendizadoContent title="Método Gamellito" trilhas={TRILHAS_SAUDE} />;
}
