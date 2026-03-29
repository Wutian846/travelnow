function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getImageForCountry(name) {
    return `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80&country=${encodeURIComponent(name)}`;
}
const BASE_URL =
  "https://restcountries.com/v3.1/all?fields=name,cca2,capital,region,subregion,population,flags,latlng,timezones,currencies";

/**
 * Parse API response and handle errors
 */
async function parseResponse(response, message) {
  if (!response.ok) throw new Error(message);
  return response.json();
}

/**
 * Transform raw country data into destination object
 */
function mapCountry(item) {
  const currencyCode = Object.keys(item.currencies || {})[0];
  const currencyName = currencyCode
    ? item.currencies[currencyCode].name
    : "Local currency";

  const lat = item.latlng?.[0] ?? 0;
  const lng = item.latlng?.[1] ?? 0;

  // Calculate offer percentage based on population
  const offer = Math.max(5, Math.min(35, Math.round(40 - item.population / 5000000)));

  // Calculate trending score based on population and capital status
  const trendingScore =
    Math.round((item.population || 0) / 1000000) + (item.capital?.length ? 8 : 0);

  // Calculate estimated trip price
  const tripPrice = Math.max(299, Math.round(1200 - offer * 10 + (lat > 30 ? 80 : 0)));

  return {
    code: item.cca2,
    name: item.name?.common || "Unknown",
    capital: item.capital?.[0] || "No capital",
    region: item.region || "Unknown",
    subregion: item.subregion || "Unknown",
    population: item.population || 0,
    flag: item.flags?.svg || item.flags?.png || "",
    lat,
    lng,
    currencyCode: currencyCode || "N/A",
    currencyName,
    timezones: item.timezones || [],
    image: getImageForCountry(item.name?.common || "travel"),
    offer,
    trendingScore,
    tripPrice,
  };
}

/**
 * Fetch all destinations from API
 */
export async function getAllDestinations() {
  const response = await fetch(BASE_URL);
  const data = await parseResponse(response, "Không thể tải dữ liệu điểm đến.");
  return data
    .map(mapCountry)
    .filter((item) => item.region && item.name)
    .sort((a, b) => b.trendingScore - a.trendingScore);
}

/**
 * Sort destinations by trending, name, offers, or nearest location
 */
export function sortDestinations(items, sortBy, userLocation) {
  const cloned = [...items];

  if (sortBy === "name-asc") {
    return cloned.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortBy === "offers") {
    return cloned.sort((a, b) => b.offer - a.offer);
  }

  if (sortBy === "nearest" && userLocation) {
    return cloned
      .map((item) => ({
        ...item,
        distanceKm: haversineDistance(
          userLocation.lat,
          userLocation.lng,
          item.lat,
          item.lng
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return cloned.sort((a, b) => b.trendingScore - a.trendingScore);
}

/**
 * Filter destinations by keyword and region
 */
export function filterDestinations(items, keyword = "", region = "all") {
  const search = keyword.toLowerCase().trim();

  return items.filter((item) => {
    const matchKeyword =
      !search ||
      item.name.toLowerCase().includes(search) ||
      item.capital.toLowerCase().includes(search) ||
      item.subregion.toLowerCase().includes(search);

    const matchRegion = region === "all" || item.region === region;

    return matchKeyword && matchRegion;
  });
}
