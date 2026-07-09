'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GamButton } from '@/components/ds/GamButton';
import { useState } from 'react';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder para lógica de envio
    console.log('Formulário enviado:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="eyebrow on-creme text-center">Fala com a gente</p>
          <h1 className="h-lg mb-4 text-center">
            Entre em <span className="hl-orange">Contato</span>
          </h1>
          <p className="text-center lead muted mb-12">
            Ficamos felizes em ouvir você. Envie suas dúvidas ou sugestões!
          </p>

          <div className="card">
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-xl font-display font-bold text-purple mb-2">
                  Mensagem enviada!
                </p>
                <p className="text-ink">
                  Obrigado por entrar em contato. Responderemos em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Assunto
                  </label>
                  <select
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida">Dúvida</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="relatorio">Relatar Problema</option>
                    <option value="parceria">Parceria</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Mensagem
                  </label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream"
                  />
                </div>

                <div className="flex gap-4 justify-center">
                  <GamButton variant="primary" type="submit">
                    Enviar mensagem
                  </GamButton>
                </div>
              </form>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="stat">
              <div className="lbl mb-1">Email</div>
              <p className="text-ink font-body text-sm">contato@gamellito.com</p>
            </div>

            <div className="stat">
              <div className="lbl mb-1">WhatsApp</div>
              <p className="text-ink font-body text-sm">+55 (11) 98765-4321</p>
            </div>

            <div className="stat">
              <div className="lbl mb-1">Horário</div>
              <p className="text-ink font-body text-sm">Seg-Sex: 9h às 18h</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
