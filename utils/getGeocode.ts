export const getGeocode = async (
  query: string
): Promise<{ lat: number; lon: number } | null> => {
  if (!query.trim() || query === "default") return null;

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${apiBaseUrl}/api/geocode?query=${query}`);
    const data = await response.json();

    if (data.lat && data.lon) {
      return { lat: data.lat, lon: data.lon };
    } else {
      return null;
    }
  } catch (error) {
    console.log("지오코딩 API 오류:", error);
    return null;
  }
};
