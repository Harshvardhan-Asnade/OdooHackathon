import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function signInWithEmail({ email, password }) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured. Using demo auth mode.') };
  }

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithProfile({ email, password, profile }) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured. Using demo auth mode.') };
  }

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: profile,
    },
  });
}

export async function signOutUser() {
  if (!isSupabaseConfigured) return { error: null };
  return supabase.auth.signOut();
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured) return { data: { session: null }, error: null };
  return supabase.auth.getSession();
}

export async function updateAuthProfile(profile) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured. Saved locally instead.') };
  }

  return supabase.auth.updateUser({
    data: profile,
  });
}
