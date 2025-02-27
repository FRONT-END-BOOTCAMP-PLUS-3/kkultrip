import { GetSpotsDTO } from "@/application/usecases/spot/dto/GetSpotsDto";
import SpotsClient from "./components/SpotsClient";
import styles from "./Spots.module.scss";

// ssr에서 명소정보를 불러오기 위한 기본 위치 설정
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

    // query가 빈 값이면 아예 API 요청에서 제외 (query 없이 요청)
    if (query && query.trim() !== "" && query !== "default") {
      queryString.push(`query=${query}`);
    }

    if (category) queryString.push(`category=${category}`);
    if (maxPrice !== undefined) queryString.push(`price=${maxPrice}`);

    if (queryString.length > 0) {
      url += `?${queryString.join("&")}`;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();

    return Array.isArray(data.spots) ? data.spots : [];
  } catch (error) {
    console.log("명소 데이터를 불러올 수 없음:", error);
    return [];
  }
};

const Spots = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;

  const lat = params.lat ? parseFloat(params.lat) : DEFAULT_LAT;
  const lon = params.lon ? parseFloat(params.lon) : DEFAULT_LON;
  const category = params.category || "";
  const maxPrice = params.price ? parseInt(params.price, 10) : undefined;
  const query = params.query || "";

  const spots = await getFilteredSpots({ lat, lon, query, category, maxPrice });

  return (
    <>
      {/* SEO 최적화를 위한 서버 사이드 렌더링 (Hidden SEO) */}
      <div className={styles.hiddenSeo}>
        <h1>주변 명소 검색 결과</h1>
        <p>
          현재 위치: {lat}, {lon}
        </p>
        {query && <p>검색어: {query}</p>}
        {category && <p>카테고리: {category}</p>}
        {maxPrice !== undefined && (
          <p>최대 가격: {maxPrice.toLocaleString()}원</p>
        )}
        <ul>
          {Array.isArray(spots) && spots.length > 0 ? (
            spots.map((spot) => (
              <li key={spot.id}>
                <h2>{spot.name}</h2>
                <p>카테고리: {spot.category}</p>
                <p>
                  위치: {spot.lat}, {spot.lon}
                </p>
                <p>
                  평균 가격:{" "}
                  {spot.avgPrice
                    ? `${spot.avgPrice.toLocaleString()}원`
                    : "가격 정보 없음"}
                </p>
              </li>
            ))
          ) : (
            <p>검색된 명소가 없습니다.</p>
          )}
        </ul>
      </div>

      {/* CSR로 작동하는 컴포넌트 */}
      <SpotsClient initialLat={lat} initialLon={lon} initialSpots={spots} />
    </>
  );
};

export default Spots;
