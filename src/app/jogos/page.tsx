'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

type Jogo = {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string | null;
  url_jogo: string | null;
  categoria: string | null;
};

export default function JogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from('jogos')
        .select('id, titulo, descricao, imagem_url, url_jogo, categoria')
        .eq('ativo', true)
        .order('ordem', { ascending: true });
      setJogos(data || []);
      setLoading(false);
    };
    carregar();
  }, [supabase]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream">
        <section className="wrap py-16 text-center">
          <p className="eyebrow on-creme">Ecossistema Gamellito</p>
          <h1 className="h-lg">Jogos <span className="hl-orange">educativos</span></h1>

          {!loading && jogos.length === 0 && (
            <>
              <p className="lead muted mt-4 max-w-2xl mx-auto">
                Seção em desenvolvimento. Jogos educativos para ensinar sobre diabetes e saúde virão em breve!
              </p>
              <div className="mt-10 flex justify-center">
                <Image src="/assets/gamellito-adventures.svg" alt="Gamellito Adventures" width={220} height={220} className="w-[220px] h-auto" />
              </div>
            </>
          )}

          {jogos.length > 0 && (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {jogos.map((jogo) => (
                <div key={jogo.id} className="card">
                  {jogo.imagem_url && (
                    <Image
                      src={jogo.imagem_url}
                      alt={jogo.titulo}
                      width={200}
                      height={200}
                      className="w-full h-40 object-contain mb-3"
                    />
                  )}
                  {jogo.categoria && <p className="tag">{jogo.categoria}</p>}
                  <h2 className="font-display font-bold text-xl text-ink mt-1">{jogo.titulo}</h2>
                  {jogo.descricao && <p className="muted text-sm mt-2">{jogo.descricao}</p>}
                  <div className="mt-4">
                    {jogo.url_jogo ? (
                      <a href={jogo.url_jogo} className="btn btn-orange btn-sm">Jogar</a>
                    ) : (
                      <span className="btn btn-cream btn-sm !cursor-default">Em breve</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
