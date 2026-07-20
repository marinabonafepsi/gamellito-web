'use client';

import { useState } from 'react';
import s from '../DashboardShell.module.css';
import { PDF_A10 } from '@/lib/modulos-content';
import { useConcluirModulo } from './ModuloCompletionContext';

export function PdfModulo() {
  const [baixado, setBaixado] = useState(false);
  const { concluir, concluindo } = useConcluirModulo();

  return (
    <>
      <p className={s.psub} style={{ marginBottom: 16 }}>{PDF_A10.intro}</p>
      <div className={s.pdfCard}>
        <div className={s.pdfIcon}>PDF</div>
        <div className={s.pdfMeta}>
          <h4>{PDF_A10.nome}</h4>
          <p>{PDF_A10.meta}</p>
        </div>
        <button
          type="button"
          className={`${s.btn} ${s.btnCream} ${s.btnSm}`}
          style={{ marginLeft: 'auto' }}
          onClick={() => setBaixado(true)}
        >
          {baixado ? 'Baixado ✓' : 'Baixar'}
        </button>
      </div>
      <button
        className={`${s.btn} ${s.btnOrange}`}
        disabled={!baixado || concluindo}
        onClick={() => concluir(3)}
      >
        {baixado ? 'Concluir módulo' : 'Baixe o modelo primeiro'}
      </button>
    </>
  );
}
