-- Supabase Database Setup for Traveloop

-- 1. Create Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  "firstName" TEXT,
  "lastName" TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  country TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  "planTier" TEXT DEFAULT 'Traveloop Pro',
  bio TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  "travelStyle" TEXT,
  "preferredBudget" NUMERIC,
  "previousTrips" JSONB DEFAULT '[]'::jsonb,
  verified BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, "firstName", "lastName", phone, city, country, bio, interests, "travelStyle", "preferredBudget")
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'lastName',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'bio',
    COALESCE((new.raw_user_meta_data->>'interests')::jsonb, '[]'::jsonb),
    new.raw_user_meta_data->>'travelStyle',
    (new.raw_user_meta_data->>'preferredBudget')::numeric
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Create Trips Table
CREATE TABLE public.trips (
  id TEXT PRIMARY KEY,
  "userId" UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  "startDate" DATE,
  "endDate" DATE,
  cities JSONB DEFAULT '[]'::jsonb,
  "coverEmoji" TEXT,
  status TEXT DEFAULT 'planning',
  travelers JSONB DEFAULT '[]'::jsonb,
  "totalBudget" NUMERIC,
  "totalSpent" NUMERIC DEFAULT 0,
  "createdBy" TEXT,
  description TEXT,
  "budgetTier" TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  "aiScore" NUMERIC,
  "weatherScore" NUMERIC,
  "optimizationScore" NUMERIC,
  "lastEditedBy" TEXT,
  "sharedAccess" TEXT DEFAULT 'owner',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trips."
  ON public.trips FOR SELECT
  USING ( auth.uid() = "userId" );

CREATE POLICY "Users can insert their own trips."
  ON public.trips FOR INSERT
  WITH CHECK ( auth.uid() = "userId" );

CREATE POLICY "Users can update their own trips."
  ON public.trips FOR UPDATE
  USING ( auth.uid() = "userId" );

CREATE POLICY "Users can delete their own trips."
  ON public.trips FOR DELETE
  USING ( auth.uid() = "userId" );

-- 3. Create Itineraries Table
CREATE TABLE public.itineraries (
  "tripId" TEXT REFERENCES public.trips(id) ON DELETE CASCADE PRIMARY KEY,
  "userId" UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sections JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on itineraries
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own itineraries."
  ON public.itineraries FOR SELECT
  USING ( auth.uid() = "userId" );

CREATE POLICY "Users can insert their own itineraries."
  ON public.itineraries FOR INSERT
  WITH CHECK ( auth.uid() = "userId" );

CREATE POLICY "Users can update their own itineraries."
  ON public.itineraries FOR UPDATE
  USING ( auth.uid() = "userId" );

CREATE POLICY "Users can delete their own itineraries."
  ON public.itineraries FOR DELETE
  USING ( auth.uid() = "userId" );
