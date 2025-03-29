import { useState } from "react";
export async function getHumidity(manualLocation?: string): Promise<number> {
  const [name, setName] = useState("7BnjF7mNEDjYVyjIvOuBQFYbFzLWLRFD");
  try {
    let locationQuery: string;

    // Try to use manual location if provided
    if (manualLocation) {
      locationQuery = manualLocation;
    } else {
      // Try geolocation, but handle the case where it's disabled
      try {
        const position = await getCurrentPosition();
        locationQuery = `${position.coords.latitude},${position.coords.longitude}`;
      } catch (geoError) {
        console.warn("Geolocation error:", geoError);
        // Default to a generic location if geolocation fails
        locationQuery = "auto:ip"; // Use IP-based location as fallback
      }
    }

    // Make API call to WeatherAPI.com
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${name}&q=${locationQuery}&aqi=no`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Weather API Error:", errorData);
      throw new Error(
        `Failed to fetch weather data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.current.humidity;
  } catch (error) {
    console.error("Weather API Error:", error);

    // Fallback to a default value if we can't get the actual humidity
    console.warn("Using fallback humidity value");
    return 50; // Default mid-range humidity
  }
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 60000,
    });
  });
}
