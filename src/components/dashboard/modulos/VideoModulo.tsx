'use client';

import { useState } from 'react';
import Image from 'next/image';
import s from '../DashboardShell.module.css';
import { VIDEO_CONTENT } from '@/lib/modulos-content-registry';
import { useConcluirModulo } from './ModuloCompletionContext';

export function VideoModulo({ moduloId }: { moduloId: string }) {
  const { caption, poster } = VIDEO_CONTENT[moduloId];
  const [playing, setPlaying] = useState(false);
  const [assistido, setAssistido] = useState(false);
  const { concluir, concluindo } = useConcluirModulo();

  const togglePlay = () => {
    setPlaying((p) => !p);
    setAssistido(true);
  };

  return (
    <>
      <div className={s.videoPlayer} onClick={togglePlay}>
        <Image src={poster} alt="" fill style={{ objectFit: 'cover', opacity: 0.5 }} />
        <div className={s.videoPlayBtn}>
          <span>{playing ? '❚❚' : '▶'}</span>
        </div>
        <div className={s.videoBar}>
          <i style={{ width: playing ? '62%' : '0%' }} />
        </div>
      </div>
      <p className={s.videoCaption}>{caption}</p>
      <button
        className={`${s.btn} ${s.btnOrange}`}
        style={{ marginTop: 22 }}
        disabled={!assistido || concluindo}
        onClick={() => concluir(3)}
      >
        {assistido ? 'Concluir módulo' : 'Assista ao vídeo primeiro'}
      </button>
    </>
  );
}
