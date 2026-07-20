-- Migration: registros.medicamentos_tomados — quais medicamentos a família
-- marcou como "tomado" no momento do registro de glicemia (etapa 2 da
-- "Missão do dia" gamificada). Lista leve de nomes/ids de medicamentos, não
-- um histórico de doses por medicamento — isso continua fora de escopo por
-- ora (ver aviso em /familia/crianca/[id]/medicamentos).

ALTER TABLE registros
  ADD COLUMN IF NOT EXISTS medicamentos_tomados TEXT[] NOT NULL DEFAULT '{}';
