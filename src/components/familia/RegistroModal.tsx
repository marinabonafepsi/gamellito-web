'use client';

import { useEffect, useRef, useState } from 'react';
import s from '@/components/dashboard/DashboardShell.module.css';

interface Medicamento {
  id: string;
  nome: string;
  tipo: 'basal' | 'bolus' | 'outro';
  dose: string;
  horarios: string;
}

interface RegistroModalProps {
  onSave: (data: {
    valor: number;
    rotulo: string;
    observacao?: string;
    lancado_por?: string;
    medicamentos_tomados?: string[];
  }) => void;
  onClose: () => void;
}

const MOMENTS = [
  { key: 'jejum', label: 'Jejum', glyph: 'J', color: 'var(--game-green)' },
  { key: 'antes', label: 'Antes de comer', glyph: 'A', color: 'var(--game-blue)' },
  { key: 'depois', label: 'Depois de comer', glyph: 'D', color: 'var(--color-orange)' },
  { key: 'dormir', label: 'Antes de dormir', glyph: 'Z', color: 'var(--color-purple)' },
];

const WHOS = [
  { key: 'Eu mesmo', label: 'Eu mesmo', glyph: 'E', color: 'var(--game-pink)' },
  { key: 'Mãe', label: 'Mãe', glyph: 'M', color: 'var(--color-purple)' },
  { key: 'Pai', label: 'Pai', glyph: 'P', color: 'var(--game-blue)' },
  { key: 'Outra pessoa', label: 'Outra pessoa', glyph: 'O', color: 'var(--color-orange)' },
];

const TIPO_COLOR: Record<Medicamento['tipo'], string> = {
  basal: 'var(--game-blue)',
  bolus: 'var(--color-orange)',
  outro: 'var(--color-purple)',
};
const TIPO_GLYPH: Record<Medicamento['tipo'], string> = { basal: 'B', bolus: 'R', outro: 'M' };

const QUICK_VALUES = [70, 100, 140, 180, 250];

const VMIN = 40;
const VMAX = 400;
const GAP_CENTER = 220;
const ARC = 280;

function clampValue(v: number) {
  return Math.max(VMIN, Math.min(VMAX, Math.round(v)));
}

function valueToAngle(v: number) {
  const shifted = ((v - VMIN) / (VMAX - VMIN)) * ARC;
  return (shifted + GAP_CENTER) % 360;
}

function classifyGlucose(v: number) {
  if (v < 70) return { label: 'Baixo', color: 'var(--color-sun)' };
  if (v > 180) return { label: 'Alto', color: 'var(--color-orange)' };
  return { label: 'No alvo', color: 'var(--game-green)' };
}

export function RegistroModal({ onSave, onClose }: RegistroModalProps) {
  const [step, setStep] = useState(0);
  const [valor, setValor] = useState(120);
  const [rotulo, setRotulo] = useState('depois');
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medsTomados, setMedsTomados] = useState<Record<string, boolean>>({});
  const [quem, setQuem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    fetch('/api/medicamentos')
      .then((r) => (r.ok ? r.json() : { medicamentos: [] }))
      .then((data) => setMedicamentos(data.medicamentos || []))
      .catch(() => {});
  }, []);

  const angleFromEvent = (e: React.PointerEvent) => {
    const el = dialRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    angle = (angle + 360) % 360;
    let shifted = (angle - GAP_CENTER + 360) % 360;
    if (shifted > ARC) {
      shifted = shifted - ARC < 360 - shifted ? ARC : 0;
    }
    return VMIN + (shifted / ARC) * (VMAX - VMIN);
  };

  const updateFromEvent = (e: React.PointerEvent) => {
    const v = angleFromEvent(e);
    if (v == null) return;
    setValor(clampValue(v));
  };

  const dialDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromEvent(e);
  };
  const dialMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) updateFromEvent(e);
  };
  const dialUp = () => {
    draggingRef.current = false;
  };

  const toggleMed = (id: string) => setMedsTomados((m) => ({ ...m, [id]: !m[id] }));
  const medsCount = Object.values(medsTomados).filter(Boolean).length;
  const coinsPreview = 15 + medsCount * 5;
  const momentLabel = MOMENTS.find((m) => m.key === rotulo)?.label || '';
  const dial = classifyGlucose(valor);

  const handleSave = () => {
    setLoading(true);
    onSave({
      valor,
      rotulo,
      lancado_por: quem || undefined,
      medicamentos_tomados: Object.keys(medsTomados).filter((id) => medsTomados[id]),
    });
  };

  return (
    <div className={s.ov} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <button className={s.mx} onClick={onClose}>✕</button>

        <div className={s.qtrail}>
          <div className={`${s.qstep} ${step === 0 ? s.qstepActive : s.qstepDone}`}>1</div>
          <div className={`${s.qline} ${step >= 1 ? s.qlineDone : ''}`} />
          <div className={`${s.qstep} ${step === 1 ? s.qstepActive : step > 1 ? s.qstepDone : ''}`}>2</div>
          <div className={`${s.qline} ${step >= 2 ? s.qlineDone : ''}`} />
          <div className={`${s.qstep} ${step === 2 ? s.qstepActive : ''}`}>3</div>
        </div>

        {step === 0 && (
          <>
            <h3 className={s.qtitle}>Qual foi sua glicemia?</h3>
            <p className={s.qsub}>Gire os botões até achar o número do aparelho</p>
            <div className={s.dialwrap}>
              <div
                ref={dialRef}
                className={s.dial}
                style={{ background: dial.color }}
                onPointerDown={dialDown}
                onPointerMove={dialMove}
                onPointerUp={dialUp}
                onPointerCancel={dialUp}
              >
                <div className={s.dialknob} style={{ transform: `rotate(${valueToAngle(valor)}deg)` }}>
                  <span className={s.dialknobDot} />
                </div>
                <div className={s.dialInner}>
                  <div className={s.dv}>{valor}</div>
                  <div className={s.du}>mg/dL</div>
                  <div className={s.dtag} style={{ background: dial.color }}>{dial.label}</div>
                </div>
              </div>
              <p className={s.dialhint}>Arraste a bolinha na borda para girar</p>
              <div className={s.dialbtns}>
                <button type="button" className={s.roundbtn} onClick={() => setValor((v) => clampValue(v - 1))}>−</button>
                <button type="button" className={s.roundbtn} onClick={() => setValor((v) => clampValue(v + 1))}>+</button>
              </div>
              <div className={s.quickchips}>
                {QUICK_VALUES.map((qv) => (
                  <button key={qv} type="button" className={s.qchip} onClick={() => setValor(qv)}>{qv}</button>
                ))}
              </div>
            </div>
            <div className={s.momtiles}>
              {MOMENTS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className={`${s.momtile} ${rotulo === m.key ? s.momtileOn : ''}`}
                  onClick={() => setRotulo(m.key)}
                >
                  <span className={s.mi} style={{ background: m.color }}>{m.glyph}</span>
                  {m.label}
                </button>
              ))}
            </div>
            <div className={s.modalnav}>
              <button type="button" className={`${s.btn} ${s.btnOrange}`} style={{ width: '100%' }} onClick={() => setStep(1)}>
                Próxima etapa →
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className={s.qtitle}>Hora dos remedinhos!</h3>
            <p className={s.qsub}>Toque em cada um que você já tomou hoje</p>
            {medicamentos.length > 0 ? (
              <div className={s.medcards}>
                {medicamentos.map((md) => (
                  <div
                    key={md.id}
                    className={`${s.medcard} ${medsTomados[md.id] ? s.medcardOn : ''}`}
                    onClick={() => toggleMed(md.id)}
                  >
                    <span className={s.mci} style={{ background: TIPO_COLOR[md.tipo] }}>{TIPO_GLYPH[md.tipo]}</span>
                    <div>
                      <div className={s.mct}>{md.nome}</div>
                      <div className={s.mcs}>{md.dose} · {md.horarios}</div>
                    </div>
                    <span className={s.medplus}>+5</span>
                    <span className={s.mcheck}>✓</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={s.psub}>Nenhum medicamento cadastrado ainda — você pode adicionar em Medicamentos.</p>
            )}
            <button type="button" className={s.medskip} onClick={() => setStep(2)}>Ainda não tomei nenhum agora</button>
            <div className={s.modalnav}>
              <button type="button" className={`${s.btn} ${s.btnCream}`} onClick={() => setStep(0)}>← Voltar</button>
              <button type="button" className={`${s.btn} ${s.btnOrange}`} onClick={() => setStep(2)}>Próxima etapa →</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className={s.qtitle}>Quem registrou hoje?</h3>
            <p className={s.qsub}>Escolha um herói para levar a estrela</p>
            <div className={s.whotiles}>
              {WHOS.map((w) => (
                <button
                  key={w.key}
                  type="button"
                  className={`${s.whotile} ${quem === w.key ? s.whotileOn : ''}`}
                  onClick={() => setQuem(w.key)}
                >
                  <span className={s.wi} style={{ background: w.color }}>{w.glyph}</span>
                  {w.label}
                </button>
              ))}
            </div>
            <div className={s.recap}>
              <div className={s.rrow}>Glicemia: <b>{valor} mg/dL</b> · {momentLabel}</div>
              <div className={s.rrow}>Remédios tomados: <b>{medsCount}</b></div>
              <div className={s.rrow}>Você vai ganhar: <b>★ {coinsPreview} moedas</b></div>
            </div>
            <div className={s.modalnav}>
              <button type="button" className={`${s.btn} ${s.btnCream}`} onClick={() => setStep(1)} disabled={loading}>← Voltar</button>
              <button type="button" className={`${s.btn} ${s.btnOrange}`} onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando…' : 'Salvar e comemorar!'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
