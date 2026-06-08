import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
// Middleware não passa pelo alias @/ — usa import direto do pacote

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Se as variáveis não estão configuradas ainda, deixa passar sem verificar.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Atualiza a sessão (necessário para o Supabase SSR)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/diario/login";
  const isDiario = pathname.startsWith("/diario");

  // Rota protegida sem sessão → redireciona para login
  if (isDiario && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/diario/login";
    return NextResponse.redirect(loginUrl);
  }

  // Já logado e tentando acessar login → redireciona para o painel
  if (isLoginPage && user) {
    const painelUrl = request.nextUrl.clone();
    painelUrl.pathname = "/diario";
    return NextResponse.redirect(painelUrl);
  }

  return response;
}

export const config = {
  matcher: ["/diario/:path*"],
};
