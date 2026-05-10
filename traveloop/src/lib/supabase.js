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

// Database CRUD operations

export async function fetchProfile(userId) {
  if (!isSupabaseConfigured) return { data: null, error: null };
  return supabase.from('profiles').select('*').eq('id', userId).single();
}

export async function updateProfileDb(userId, profileData) {
  if (!isSupabaseConfigured) return { data: null, error: null };
  return supabase.from('profiles').update(profileData).eq('id', userId);
}

export async function fetchUserTrips(userId) {
  if (!isSupabaseConfigured) return { data: [], error: null };
  return supabase.from('trips').select('*').eq('userId', userId).order('createdAt', { ascending: false });
}

export async function fetchUserItineraries(userId) {
  if (!isSupabaseConfigured) return { data: [], error: null };
  return supabase.from('itineraries').select('*').eq('userId', userId);
}

export async function insertTrip(trip) {
  if (!isSupabaseConfigured) return { data: null, error: null };
  return supabase.from('trips').insert([trip]).select().single();
}

export async function updateTripInDb(tripId, updates) {
  if (!isSupabaseConfigured) return { data: null, error: null };
  return supabase.from('trips').update(updates).eq('id', tripId).select().single();
}

export async function deleteTripFromDb(tripId) {
  if (!isSupabaseConfigured) return { data: null, error: null };
  return supabase.from('trips').delete().eq('id', tripId);
}

export async function upsertItinerary(itinerary) {
  if (!isSupabaseConfigured) return { data: null, error: null };
  return supabase.from('itineraries').upsert([itinerary], { onConflict: 'tripId' }).select().single();
}
