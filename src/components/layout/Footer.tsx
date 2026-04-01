export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between md:px-6">
        <p>
          © {new Date().getFullYear()} Gamellito Ltda. Todos os direitos
          reservados.
        </p>
        <p>
          Nasce na UEL como projeto acadêmico e segue em parceria com
          universidades, serviços de saúde e famílias.
        </p>
      </div>
    </footer>
  );
}

