import { GetSpotsDTO } from "@/application/usecases/spot/dto/GetSpotsDto";
import SearchFilter from "./components/SearchFilter";
import NaverMap from "./components/NaverMap";
import BottomSheet from "./components/BottomSheet";

// 기본 위치 설정 (서울)
const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.978;

const getFilteredSpots = async ({
  lat,
  lon,
  query,
  category,
  maxPrice,
}: {
  lat: number;
  lon: number;
  query?: string;
  category?: string;
  maxPrice?: number;
}): Promise<GetSpotsDTO[]> => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  try {
    let url = `${apiBaseUrl}/api/spots`;
    const queryString = [];

    queryString.push(`lat=${lat}`);
    queryString.push(`lon=${lon}`);

    if (query && query.trim() !== "" && query !== "default") {
      queryString.push(`query=${query}`);
    }

    if (category) queryString.push(`category=${category}`);
    if (maxPrice !== undefined) queryString.push(`price=${maxPrice}`);

    if (queryString.length > 0) {
      url += `?${queryString.join("&")}`;
    }

    const res = await fetch(url, { cache: "no-cache" }); // 캐시 확인 후 변경 시 새 요청
    if (!res.ok) {
      try {
        const errorData = await res.json();
        console.log("❌ 명소 데이터를 불러올 수 없음:", errorData);
        throw new Error(errorData.error || "서버 오류 발생");
      } catch {
        const errorText = await res.text();
        console.log(
          "❌ 명소 데이터를 불러올 수 없음 (텍스트 오류):",
          errorText
        );
        throw new Error(errorText);
      }
    }

    const data = await res.json();
    return Array.isArray(data.spots) ? data.spots : [];
  } catch (error) {
    console.log("❌ 명소 데이터를 불러올 수 없음:", error);
    return [];
  }
};

const Spots = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | undefined;
    lat: string;
    lon: string;
  }>;
}) => {
  const params = await searchParams;
  // URL에서 `lat, lon` 가져오기 (없으면 기본값)
  const lat = params.lat ? parseFloat(params.lat) : DEFAULT_LAT;
  const lon = params.lon ? parseFloat(params.lon) : DEFAULT_LON;
  const category = params.category || "";
  const maxPrice = params.price ? parseInt(params.price, 10) : undefined;
  const query = params.query || "";

  // 명소 데이터 SSR에서 무조건 가져오기
  const spots = await getFilteredSpots({ lat, lon, query, category, maxPrice });

  return (
    <>
      <SearchFilter />
      <NaverMap lat={lat} lon={lon} spots={spots} />
      <BottomSheet spots={spots} />
    </>
  );
};

export default Spots;
