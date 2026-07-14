import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Service-role client: server-side only, bypasses RLS. Never ship this key to a client.
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
