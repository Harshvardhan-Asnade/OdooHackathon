export function getCityImageUrl(city, width = 800, height = 600) {
  if (!city) return `https://loremflickr.com/${width}/${height}/travel/all`;
  // Clean up the city string (e.g. "Paris, France" -> "Paris")
  const mainCity = city.split(',')[0].trim();
  // Using loremflickr to get a random image based on the city name and landmark/travel keywords
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(mainCity)},landmark/all`;
}
