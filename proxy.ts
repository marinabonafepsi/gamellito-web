import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/diario/login";
  const isConsentPage = pathname === "/diario/consentimento";
  const isDiario = pathname.startsWith("/diario");

  // Sem sessão → login
  if (isDiario && !isLoginPage && !isConsentPage && !user) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/diario/login";
    return NextResponse.redirect(dest);
  }

  // Já logado tentando acessar login → diário
  if (isLoginPage && user) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/diario";
    return NextResponse.redirect(dest);
  }

  // Logado mas sem consentimento registrado → tela de consentimento
  if (user && isDiario && !isLoginPage && !isConsentPage) {
    const consentido = request.cookies.get("diario_consentido")?.value === "1";
    if (!consentido) {
      const dest = request.nextUrl.clone();
      dest.pathname = "/diario/consentimento";
      return NextResponse.redirect(dest);
    }
  }

  return response;
}

export const config = {
  matcher: ["/diario/:path*"],
};
