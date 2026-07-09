'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface RewardModalProps {
  coins: number;
  onClose: () => void;
}

export function RewardModal({ coins, onClose }: RewardModalProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="reward-overlay" onClick={onClose}>
      <div className="reward-card" onClick={(e) => e.stopPropagation()}>
        <Image
          src="/assets/gamellito-contente.svg"
          alt=""
          width={130}
          height={130}
          className="reward-icon"
        />
        <h3>Registro salvo!</h3>
        <p className="reward-coins">+{coins} moedas Gamellito</p>
        <p className="reward-note">A gente comemora o registro, não o número. Bora manter o streak!</p>
        <button
          className="btn btn-orange"
          style={{ padding: '9px 16px', fontSize: 13.5, boxShadow: '3px 3px 0 #2b2233' }}
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
