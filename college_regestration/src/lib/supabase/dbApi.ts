import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseRLS = import.meta.env.VITE_SUPABASE_RLS;
export const supabaseJWT = import.meta.env.VITE_SUPABASE_JWT_KET;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
