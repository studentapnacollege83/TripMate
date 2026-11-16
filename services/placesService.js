const searchWikipediaPlace = async (placeName) => {
  if (!placeName) {
    return null;
  }

  try {
    const searchUrl =
      `https://en.wikipedia.org/w/api.php` +
      `?action=query` +
      `&list=search` +
      `&srsearch=${encodeURIComponent(`"${placeName}"`)}` +
      `&srnamespace=0` +
      `&srlimit=5` +
      `&format=json`;

    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      return null;
    }

    const searchData = await searchResponse.json();

    const results = searchData.query?.search || [];

    if (results.length === 0) {
      return null;
    }

    const bestMatch = results[0];

    const imageUrl =
      `https://en.wikipedia.org/w/api.php` +
      `?action=query` +
      `&titles=${encodeURIComponent(bestMatch.title)}` +
      `&prop=pageimages|extracts` +
      `&piprop=thumbnail` +
      `&pithumbsize=700` +
      `&exintro=true` +
      `&explaintext=true` +
      `&format=json`;

    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return {
        title: bestMatch.title,
        image: null,
        description: null
      };
    }

    const imageData = await imageResponse.json();

    const pages = imageData.query?.pages || {};
    const page = Object.values(pages)[0];

    return {
      title: bestMatch.title,
      image: page?.thumbnail?.source || null,
      description: page?.extract || null
    };

  } catch (error) {
    console.error(
      "Wikipedia image error:",
      placeName,
      error.message
    );

    return null;
  }
};


const getCountryInfo = async (query) => {
  try {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?q=${encodeURIComponent(query)}` +
      `&format=jsonv2` +
      `&limit=5` +
      `&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "TripMate Travel App"
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const country = data.find(
      (item) =>
        item.addresstype === "country" &&
        item.address?.country_code
    );

    if (!country) {
      return null;
    }

    return {
      name: country.display_name,
      lat: Number(country.lat),
      lon: Number(country.lon),
      boundingBox: country.boundingbox.map(Number),
      countryCode: country.address.country_code
    };

  } catch (error) {
    console.error("Country info error:", error.message);
    return null;
  }
};

const searchPlaces = async (city) => {
  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  if (!apiKey) {
    throw new Error("OPENTRIPMAP_API_KEY is missing.");
  }
  const countryInfo = await getCountryInfo(city);
if (countryInfo) {
  const countryCode = countryInfo.countryCode;

  const countryPlacesUrl =
    `https://api.opentripmap.com/0.1/en/places/bbox` +
    `?lon_min=${countryInfo.boundingBox[2]}` +
    `&lat_min=${countryInfo.boundingBox[0]}` +
    `&lon_max=${countryInfo.boundingBox[3]}` +
    `&lat_max=${countryInfo.boundingBox[1]}` +
    `&kinds=interesting_places` +
    `&limit=30` +
    `&apikey=${apiKey}`;

  console.log("COUNTRY CODE:", countryCode);

  const countryResponse = await fetch(countryPlacesUrl);

  if (countryResponse.ok) {
    const countryData = await countryResponse.json();

    console.log(
      "COUNTRY PLACES:",
      countryData.features?.length || 0
    );
  }
}
 
  // Find destination coordinates
  const geocodeUrl =
    `https://api.opentripmap.com/0.1/en/places/geoname` +
    `?name=${encodeURIComponent(city)}` +
    `&apikey=${apiKey}`;

  const geocodeResponse = await fetch(geocodeUrl);

  if (!geocodeResponse.ok) {
    throw new Error("Could not find destination.");
  }

  const location = await geocodeResponse.json();

  if (!location.lat || !location.lon) {
    throw new Error("Destination coordinates not found.");
  }

  console.log(
    "Destination:",
    location.name,
    location.lat,
    location.lon
  );


  // Find nearby tourist places
const placesUrl =
  `https://api.opentripmap.com/0.1/en/places/radius` +
  `?radius=30000` +
  `&lon=${location.lon}` +
  `&lat=${location.lat}` +
  `&kinds=interesting_places` +
  `&limit=30` +
  `&apikey=${apiKey}`;
  const placesResponse = await fetch(placesUrl);

  if (!placesResponse.ok) {
    throw new Error("Could not fetch places.");
  }

  const data = await placesResponse.json();

const places = (data.features || [])
  .filter((place) => {
    const name = place.properties?.name?.trim();

    return name && name.length >= 3;
  })
  .sort((a, b) => {
    const rateA = Number(a.properties?.rate || 0);
    const rateB = Number(b.properties?.rate || 0);

    return rateB - rateA;
  })
 


  // Add exact place-specific Wikipedia data
  const placesWithDetails = await Promise.all(
    places.map(async (place) => {

      const name = place.properties.name.trim();

      const wiki = await searchWikipediaPlace(name);

      return {
        ...place,

        image: wiki?.image || null,

        description: wiki?.description || null,

        wikipediaTitle: wiki?.title || null
      };
    })
  );


  console.log(
    "Places found:",
    placesWithDetails.length
  );

  return {
    city: location.name || city,
    places: placesWithDetails
  };
};
const getPlaceDetails = async (xid) => {
  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  if (!apiKey) {
    throw new Error("OPENTRIPMAP_API_KEY is missing.");
  }

  const url =
    `https://api.opentripmap.com/0.1/en/places/xid/${encodeURIComponent(xid)}` +
    `?apikey=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch place details.");
  }

  const data = await response.json();

  return {
    name: data.name || "Interesting Place",
    kinds: data.kinds || "",
    description: data.wikipedia_extracts?.text || "",
    address: data.address
      ? Object.values(data.address).filter(Boolean).join(", ")
      : "",
    latitude: data.point?.lat || null,
    longitude: data.point?.lon || null
  };
};

module.exports = {
  searchPlaces,
  getPlaceDetails,
  
  getCountryInfo,
  
};