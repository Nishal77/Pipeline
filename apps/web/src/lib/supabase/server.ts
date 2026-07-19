import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Standard @supabase/ssr server client — cookie-backed session, used in
// Server Components/Actions. Anon key only; RLS (owner_auth_id = auth.uid())
// is what actually scopes every query to the signed-in owner's own account.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — middleware refreshes the session instead.
        }
      },
    },
  });
}
