'use client';

import { useState } from 'react';
import Image from 'next/image';
import s from '../DashboardShell.module.css';
import { VIDEO_A3 } from '@/lib/modulos-content';
import { useConcluirModulo } from './ModuloCompletionContext';

export function VideoModulo({ voltarHref: _voltarHref }: { voltarHref: string }) {
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
        <Image src={VIDEO_A3.poster} alt="" fill style={{ objectFit: 'cover', opacity: 0.5 }} />
        <div className={s.videoPlayBtn}>
          <span>{playing ? '❚❚' : '▶'}</span>
        </div>
        <div className={s.videoBar}>
          <i style={{ width: playing ? '62%' : '0%' }} />
        </div>
      </div>
      <p className={s.videoCaption}>{VIDEO_A3.caption}</p>
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
