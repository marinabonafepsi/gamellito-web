-- Migration: registros.contexto — tag opcional de contexto no momento do
-- registro de glicemia ("Fez exercício", "Não tá bem", "Dia estressante",
-- "Comida diferente"). Puramente informativo para a família revisar depois
-- ou levar à consulta — o diário não usa isso para classificar o valor.

ALTER TABLE registros
  ADD COLUMN IF NOT EXISTS contexto TEXT;
