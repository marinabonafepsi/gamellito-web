'use client';

import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function JogosPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream">
        <section className="wrap py-16 text-center">
          <p className="eyebrow on-creme">Ecossistema Gamellito</p>
          <h1 className="h-lg">Jogos <span className="hl-orange">educativos</span></h1>
          <p className="lead muted mt-4 max-w-2xl mx-auto">
            Seção em desenvolvimento. Jogos educativos para ensinar sobre diabetes e saúde virão em breve!
          </p>
          <div className="mt-10 flex justify-center">
            <Image src="/assets/gamellito-adventures.svg" alt="Gamellito Adventures" width={220} height={220} className="w-[220px] h-auto" />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
