// Pedaços pequenos e visuais reaproveitados pelos formulários de login e
// cadastro (AuthModal e SignupForm) — sem lógica de estado própria.

export const inputClass =
  'w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm';

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink mb-2">{label}</label>
      {children}
    </div>
  );
}

export function ErrorBox({ message, className = '' }: { message: string; className?: string }) {
  return (
    <div className={`bg-game-red/10 border-2 border-game-red rounded-[16px] p-3 text-game-red text-sm font-bold ${className}`}>
      {message}
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.32z" />
      <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.62-2.44l-3.23-2.5c-.9.6-2.05.96-3.4.96-2.6 0-4.8-1.76-5.6-4.12H1.06v2.58A10 10 0 0 0 10 20z" />
      <path fill="#FBBC05" d="M4.4 11.9a6 6 0 0 1 0-3.8V5.52H1.06a10 10 0 0 0 0 8.96l3.35-2.58z" />
      <path fill="#EA4335" d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 10 0 10 10 0 0 0 1.06 5.52L4.4 8.1C5.2 5.74 7.4 3.98 10 3.98z" />
    </svg>
  );
}
