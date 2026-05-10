import {
  destinationCatalog,
  recommendationCatalog,
  travelUpdates,
  weatherUpdates,
} from '../data/mockData';

const DEFAULT_SPEED_KMH = {
  flight: 720,
  train: 150,
  drive: 78,
  walk: 4.5,
};

const interestWeights = {
  Food: ['Restaurant', 'Food', 'Local favorite', 'Cicchetti', 'Carbonara'],
  History: ['Activity', 'History', 'Museums', 'Architecture'],
  Museums: ['Museums', 'Art', 'Activity'],
  Architecture: ['Architecture', 'Walkable'],
  Wellness: ['Wellness', 'Nature', 'Free'],
  Beach: ['Nature', 'Beach'],
  Technology: ['Transit', 'Efficient'],
  Photography: ['Photography', 'Walkable'],
};

export function getDestination(cityName) {
  if (!cityName) return null;
  return destinationCatalog.find(
    (destination) => destination.name.toLowerCase() === cityName.toLowerCase(),
  );
}

export function getTripDestinations(trip) {
  return (trip?.cities || [])
    .map((city) => getDestination(city))
    .filter(Boolean);
}

export function getTripDurationDays(trip) {
  if (!trip?.startDate || !trip?.endDate) return Math.max(trip?.cities?.length || 1, 1);
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(diff, 1);
}

export function getDailyDates(trip) {
  const days = getTripDurationDays(trip);
  const start = trip?.startDate ? new Date(trip.startDate) : new Date();

  return Array.from({ length: days }, (_, index) => {
    const next = new Date(start);
    next.setDate(start.getDate() + index);
    return next.toISOString().slice(0, 10);
  });
}

export function calculateDistanceKm(from, to) {
  if (!from || !to) return 0;
  const radius = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function getTransitMode(distanceKm) {
  if (distanceKm < 8) return 'walk';
  if (distanceKm < 650) return 'train';
  return 'flight';
}

export function estimateTravelTime(distanceKm, mode = getTransitMode(distanceKm)) {
  const speed = DEFAULT_SPEED_KMH[mode] || DEFAULT_SPEED_KMH.train;
  const hours = distanceKm / speed;
  const connectionBuffer = mode === 'flight' ? 2.2 : mode === 'train' ? 0.45 : 0.1;
  const totalHours = Math.max(hours + connectionBuffer, 0.25);

  if (totalHours < 1) return `${Math.round(totalHours * 60)} min`;
  return `${totalHours.toFixed(totalHours >= 10 ? 0 : 1)} hr`;
}

export function calculateRouteSummary(stops) {
  const segments = [];
  let distanceKm = 0;
  let travelHours = 0;

  stops.forEach((stop, index) => {
    const next = stops[index + 1];
    if (!next) return;

    const distance = calculateDistanceKm(stop, next);
    const mode = getTransitMode(distance);
    const hours = distance / (DEFAULT_SPEED_KMH[mode] || DEFAULT_SPEED_KMH.train)
      + (mode === 'flight' ? 2.2 : mode === 'train' ? 0.45 : 0.1);

    distanceKm += distance;
    travelHours += hours;
    segments.push({
      from: stop.name,
      to: next.name,
      distanceKm: distance,
      mode,
      duration: estimateTravelTime(distance, mode),
    });
  });

  return {
    distanceKm,
    travelHours,
    segments,
    efficiencyScore: Math.max(52, Math.round(100 - (travelHours / Math.max(stops.length, 1)) * 4)),
  };
}

export function optimizeRoute(stops) {
  if (!stops?.length) return [];

  const remaining = stops.slice(1);
  const optimized = [stops[0]];

  while (remaining.length) {
    const current = optimized[optimized.length - 1];
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    remaining.forEach((candidate, index) => {
      const distance = calculateDistanceKm(current, candidate);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    optimized.push(remaining.splice(bestIndex, 1)[0]);
  }

  return optimized;
}

function getBudgetMultiplier(tier) {
  if (tier === 'Luxury' || tier === 'Premium') return 1.25;
  if (tier === 'Budget') return 0.74;
  return 1;
}

export function estimateTripBudget(trip) {
  const destinations = getTripDestinations(trip);
  const days = getTripDurationDays(trip);
  const dailyBase = destinations.length
    ? destinations.reduce((sum, destination) => sum + destination.avgDailyBudget, 0) / destinations.length
    : 180;
  const multiplier = getBudgetMultiplier(trip?.budgetTier);
  const travelers = Math.max(trip?.travelers?.length || 1, 1);
  const total = Math.round(dailyBase * days * multiplier * travelers);
  const route = calculateRouteSummary(destinations);
  const transport = Math.round(route.distanceKm * 0.18 * travelers);
  const lodging = Math.round(total * 0.38);
  const food = Math.round(total * 0.22);
  const activities = Math.round(total * 0.18);
  const buffer = Math.max(Math.round(total * 0.08), 120);

  return {
    total: lodging + food + activities + transport + buffer,
    dailyBase: Math.round(dailyBase * multiplier),
    categories: [
      { name: 'Hotels', amount: lodging, color: 'var(--terracotta)', pct: 38 },
      { name: 'Food', amount: food, color: 'var(--teal)', pct: 22 },
      { name: 'Activities', amount: activities, color: 'var(--gold)', pct: 18 },
      { name: 'Transport', amount: transport, color: 'var(--sage)', pct: 14 },
      { name: 'Flex buffer', amount: buffer, color: 'var(--rose)', pct: 8 },
    ],
    suggestions: [
      { id: 'b1', text: 'Replace one premium dinner with a highly rated neighborhood spot', savings: Math.round(food * 0.08), impact: 'Low' },
      { id: 'b2', text: 'Move mid-distance transfers to rail where routes are under 650 km', savings: Math.round(Math.max(transport * 0.22, 45)), impact: 'Low' },
      { id: 'b3', text: 'Book timed museum entries before raising daily activity budget', savings: Math.round(activities * 0.1), impact: 'None' },
      { id: 'b4', text: 'Keep hotels within 1.5 km of evening food clusters to reduce taxis', savings: Math.round(Math.max(transport * 0.16, 30)), impact: 'Medium' },
    ],
  };
}

export function getPersonalizedRecommendations(profile, trip) {
  const interests = new Set([...(profile?.interests || []), ...(trip?.interests || [])]);
  const cities = new Set(trip?.cities || []);

  return recommendationCatalog
    .filter((item) => cities.size === 0 || cities.has(item.city))
    .map((item) => {
      const tags = [...item.tags, item.type];
      const fit = tags.reduce((score, tag) => {
        const matches = [...interests].some((interest) => {
          const weightedTags = interestWeights[interest] || [interest];
          return weightedTags.some((weighted) => tag.toLowerCase().includes(weighted.toLowerCase()));
        });
        return score + (matches ? 12 : 0);
      }, 68);

      return { ...item, fitScore: Math.min(fit + Math.round(item.rating * 3), 99) };
    })
    .sort((a, b) => b.fitScore - a.fitScore);
}

export function getWeatherForTrip(trip) {
  const cities = new Set(trip?.cities || []);
  return weatherUpdates.filter((update) => cities.has(update.city));
}

export function getTravelUpdatesForTrip(trip) {
  const cities = new Set(trip?.cities || []);
  return travelUpdates.filter((update) => cities.has(update.city));
}

export function createDayWiseItinerary(trip, profile = {}) {
  const dates = getDailyDates(trip);
  const destinations = getTripDestinations(trip);
  const interests = [...new Set([...(trip?.interests || []), ...(profile?.interests || [])])];
  const recs = getPersonalizedRecommendations(profile, trip);

  return dates.map((date, index) => {
    const destination = destinations[index % Math.max(destinations.length, 1)];
    const city = destination?.name || trip?.cities?.[0] || 'Destination';
    const cityRecs = recs.filter((rec) => rec.city === city);
    const morning = cityRecs.find((rec) => rec.type === 'Activity')?.name || `${city} orientation walk`;
    const lunch = cityRecs.find((rec) => rec.type === 'Restaurant')?.name || `Local lunch in ${city}`;
    const evening = cityRecs.find((rec) => rec.type !== 'Hotel' && rec.name !== morning)?.name || `${city} neighborhood discovery`;

    return {
      day: index + 1,
      date,
      city,
      focus: interests[index % Math.max(interests.length, 1)] || 'Discovery',
      budget: Math.round((destination?.avgDailyBudget || 180) * getBudgetMultiplier(trip?.budgetTier)),
      activities: [
        { time: '09:00', name: morning, expense: morning.includes('walk') ? 0 : 45 },
        { time: '13:00', name: lunch, expense: 35 },
        { time: '16:00', name: evening, expense: 30 },
        { time: '20:00', name: `Flexible dinner near ${cityRecs[0]?.distanceKm || 1} km activity cluster`, expense: 45 },
      ],
    };
  });
}

export function buildSmartTripSummary(profile, trip) {
  const stops = getTripDestinations(trip);
  const optimizedStops = optimizeRoute(stops);
  const currentRoute = calculateRouteSummary(stops);
  const optimizedRoute = calculateRouteSummary(optimizedStops);
  const budget = estimateTripBudget(trip);
  const recs = getPersonalizedRecommendations(profile, trip);
  const weather = getWeatherForTrip(trip);

  return {
    budget,
    currentRoute,
    optimizedRoute,
    routeSavingsKm: Math.max(currentRoute.distanceKm - optimizedRoute.distanceKm, 0),
    topRecommendations: recs.slice(0, 4),
    weatherRisk: weather.some((item) => item.risk === 'Medium') ? 'Medium' : 'Low',
  };
}

export function parseCityInput(place) {
  return String(place || '')
    .split(',')
    .map((city) => city.trim())
    .filter(Boolean);
}
