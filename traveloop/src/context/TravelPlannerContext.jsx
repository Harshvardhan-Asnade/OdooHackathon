import { useEffect, useState } from 'react';
import {
  currentUser,
  itineraries as defaultItineraries,
  trips as defaultTrips,
} from '../data/mockData';
import {
  getCurrentSession,
  isSupabaseConfigured,
  signInWithEmail,
  signOutUser,
  signUpWithProfile,
  updateAuthProfile,
  fetchProfile,
  updateProfileDb,
  fetchUserTrips,
  fetchUserItineraries,
  insertTrip,
  updateTripInDb,
  deleteTripFromDb,
  upsertItinerary,
} from '../lib/supabase';
import { createDayWiseItinerary, parseCityInput } from '../lib/plannerEngine';
import { TravelPlannerContext } from './plannerContextValue';

const STORAGE_KEY = 'traveloop-planner-state-v2';
const THEME_KEY = 'traveloop-theme';

function readStoredState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Could not read Traveloop local state:', error);
    return null;
  }
}

function persistState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Could not persist Traveloop local state:', error);
  }
}

function profileFromSupabaseUser(user) {
  const metadata = user?.user_metadata || {};
  return {
    ...currentUser,
    id: user?.id || currentUser.id,
    email: user?.email || currentUser.email,
    firstName: metadata.firstName || metadata.first_name || currentUser.firstName,
    lastName: metadata.lastName || metadata.last_name || currentUser.lastName,
    phone: metadata.phone || currentUser.phone,
    city: metadata.city || currentUser.city,
    country: metadata.country || currentUser.country,
    bio: metadata.bio || currentUser.bio,
    interests: metadata.interests || currentUser.interests,
    travelStyle: metadata.travelStyle || currentUser.travelStyle,
    preferredBudget: metadata.preferredBudget || currentUser.preferredBudget,
  };
}

function makeTripFromForm(form, profile) {
  const cities = parseCityInput(form.place || form.destination || form.cities?.join(','));
  const firstCity = cities[0] || 'New trip';
  const id = `t${Date.now()}`;

  return {
    id,
    name: form.name || `${firstCity} Adventure`,
    startDate: form.startDate,
    endDate: form.endDate,
    cities: cities.length ? cities : [firstCity],
    coverEmoji: form.coverEmoji || '🌍',
    status: 'planning',
    travelers: form.travelers?.length ? form.travelers : [profile.firstName],
    totalBudget: Number(form.totalBudget || profile.preferredBudget || 4000),
    totalSpent: 0,
    createdBy: profile.firstName,
    description: form.description || '',
    budgetTier: form.budgetTier || 'Comfort',
    interests: form.interests?.length ? form.interests : profile.interests,
    aiScore: 88,
    weatherScore: 82,
    optimizationScore: 80,
    lastEditedBy: profile.firstName,
    sharedAccess: 'owner',
  };
}

export function TravelPlannerProvider({ children }) {
  const stored = typeof window !== 'undefined' ? readStoredState() : null;
  const [profile, setProfile] = useState(stored?.profile || currentUser);
  const [trips, setTrips] = useState(stored?.trips || defaultTrips);
  const [itineraries, setItineraries] = useState(stored?.itineraries || defaultItineraries);
  const [session, setSession] = useState(null);
  const [authStatus, setAuthStatus] = useState('checking');
  const [theme, setTheme] = useState(() => (
    typeof window !== 'undefined'
      ? window.localStorage.getItem(THEME_KEY) || 'light'
      : 'light'
  ));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    persistState({ profile, trips, itineraries });
  }, [profile, trips, itineraries]);

  useEffect(() => {
    let active = true;

    async function syncSession() {
      const { data } = await getCurrentSession();
      if (!active) return;
      setSession(data?.session || null);
      if (data?.session?.user) {
        const user = data.session.user;
        const profileData = await fetchProfile(user.id);
        if (profileData.data) {
          setProfile(profileFromSupabaseUser({ ...user, user_metadata: profileData.data }));
        } else {
          setProfile(profileFromSupabaseUser(user));
        }

        const tripsData = await fetchUserTrips(user.id);
        if (tripsData.data?.length) {
          setTrips(tripsData.data);
        }

        const itinsData = await fetchUserItineraries(user.id);
        if (itinsData.data?.length) {
          const loadedItins = {};
          itinsData.data.forEach(itin => {
            loadedItins[itin.tripId] = { sections: itin.sections };
          });
          setItineraries(loadedItins);
        }
      }
      setAuthStatus(data?.session || !isSupabaseConfigured ? 'authenticated' : 'guest');
    }

    syncSession();
    return () => {
      active = false;
    };
  }, []);

  async function login({ email, password }) {
    setAuthStatus('checking');

    if (isSupabaseConfigured) {
      const { data, error } = await signInWithEmail({ email, password });
      if (error) {
        setAuthStatus('guest');
        throw error;
      }

      setSession(data.session);
      setProfile(profileFromSupabaseUser(data.user));
      setAuthStatus('authenticated');
      return data.user;
    }

    const demoProfile = {
      ...currentUser,
      email: email || currentUser.email,
      firstName: email ? email.split('@')[0].split(/[._-]/)[0] || currentUser.firstName : currentUser.firstName,
    };
    setProfile(demoProfile);
    setAuthStatus('authenticated');
    return demoProfile;
  }

  async function register(form) {
    const profilePayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      city: form.city,
      country: form.country,
      bio: form.bio,
      interests: form.interests,
      travelStyle: form.travelStyle,
      preferredBudget: Number(form.preferredBudget || currentUser.preferredBudget),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await signUpWithProfile({
        email: form.email,
        password: form.password,
        profile: profilePayload,
      });
      if (error) throw error;
      setSession(data.session);
      if (data.user) setProfile(profileFromSupabaseUser(data.user));
      setAuthStatus('authenticated');
      return data.user;
    }

    const localProfile = { ...currentUser, ...profilePayload, email: form.email };
    setProfile(localProfile);
    setAuthStatus('authenticated');
    return localProfile;
  }

  async function logout() {
    await signOutUser();
    setSession(null);
    setAuthStatus('guest');
  }

  async function saveProfile(nextProfile) {
    setProfile(nextProfile);
    await updateAuthProfile(nextProfile);
    if (isSupabaseConfigured && session?.user?.id) {
      const dbProfile = { ...nextProfile };
      delete dbProfile.id; // don't update ID
      delete dbProfile.email; // email shouldn't be directly updated here
      delete dbProfile.role; // don't allow changing role
      delete dbProfile.verified;
      delete dbProfile.planTier;
      await updateProfileDb(session.user.id, dbProfile);
    }
  }

  async function createTrip(form) {
    const trip = makeTripFromForm(form, profile);
    trip.userId = session?.user?.id || null;
    const days = createDayWiseItinerary(trip, profile);
    const sections = trip.cities.map((city, index) => {
      const cityDays = days.filter((day) => day.city === city);
      return {
        id: `s-${trip.id}-${index}`,
        title: `${city} Focus`,
        description: trip.description || `AI-ready itinerary stop for ${city}.`,
        dateRange: cityDays.length
          ? `${cityDays[0].date} - ${cityDays[cityDays.length - 1].date}`
          : `${trip.startDate} - ${trip.endDate}`,
        budget: Math.round(trip.totalBudget / Math.max(trip.cities.length, 1)),
        days: cityDays,
      };
    });

    setTrips((current) => [trip, ...current]);
    setItineraries((current) => ({
      ...current,
      [trip.id]: { sections },
    }));

    if (isSupabaseConfigured && session?.user?.id) {
      await insertTrip(trip);
      await upsertItinerary({ tripId: trip.id, userId: session.user.id, sections });
    }

    return trip;
  }

  async function updateTrip(tripId, patch) {
    setTrips((current) => current.map((trip) => (
      trip.id === tripId ? { ...trip, ...patch, lastEditedBy: profile.firstName } : trip
    )));
    if (isSupabaseConfigured && session?.user?.id) {
      await updateTripInDb(tripId, patch);
    }
  }

  async function deleteTrip(tripId) {
    setTrips((current) => current.filter((trip) => trip.id !== tripId));
    setItineraries((current) => {
      const next = { ...current };
      delete next[tripId];
      return next;
    });
    if (isSupabaseConfigured && session?.user?.id) {
      await deleteTripFromDb(tripId);
    }
  }

  async function updateItinerary(tripId, itinerary) {
    setItineraries((current) => ({
      ...current,
      [tripId]: itinerary,
    }));
    updateTrip(tripId, { optimizationScore: 91 });
    if (isSupabaseConfigured && session?.user?.id) {
      await upsertItinerary({ tripId, userId: session.user.id, sections: itinerary.sections || [] });
    }
  }

  function getTripById(tripId) {
    return trips.find((trip) => trip.id === tripId) || trips[0];
  }

  const value = {
    authStatus,
    createTrip,
    deleteTrip,
    getTripById,
    isDemoMode: !isSupabaseConfigured,
    itineraries,
    login,
    logout,
    profile,
    register,
    saveProfile,
    session,
    setTheme,
    theme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    trips,
    updateItinerary,
    updateTrip,
  };

  return (
    <TravelPlannerContext.Provider value={value}>
      {children}
    </TravelPlannerContext.Provider>
  );
}
