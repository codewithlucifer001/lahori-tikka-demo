import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tlavcvmlbrmydcvmkoyj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_NGqLh6A32QfDTm_B162-gQ_8SGbTD4R';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);