import NaverMap from "./components/NaverMap";
import BottomSheet from "./components/BottomSheet";
import SearchFilter from "./components/SearchFilter";

interface Spot {
  id: number;
  name: string;
  category: string;
  avgPrice?: number;
  lat: number;
  lng: number;
  bookmarkCnt: number;
  tipCnt: number;
  time?: string;
  img: string;
}

const getFilteredSpots = async (
  query?: string,
  category?: string,
  maxPrice?: number
): Promise<Spot[]> => {
  let spots: Spot[] = [];

  if (query) {
    // 검색어가 명소 이름인지 지역인지 확인
    const geoRes = await fetch(
      `https://api.example.com/geocode?query=${query}`
    );
    const geoData = await geoRes.json();

    if (geoData?.lat && geoData?.lng) {
      // 지역 검색: 해당 지역을 중심으로 1km 이내 명소 가져오기
      const res = await fetch(
        `/api/spots?lat=${geoData.lat}&lng=${geoData.lng}&radius=1000`,
        { cache: "no-store" }
      );
      spots = await res.json();
    } else {
      // 명소 검색: 해당 명소만 가져오기
      const res = await fetch(`/api/spots?query=${query}`, {
        cache: "no-store",
      });
      spots = await res.json();
    }
  } else {
    // 기본 데이터: 내 위치 기준 1km 내 명소 가져오기
    const userLat = 37.5665;
    const userLng = 126.978;
    const res = await fetch(
      `/api/spots?lat=${userLat}&lng=${userLng}&radius=1000`,
      { cache: "no-store" }
    );
    spots = await res.json();
  }

  // 카테고리 필터링
  if (category) {
    spots = spots.filter((spot) => spot.category === category);
  }

  // 가격 필터링
  if (maxPrice !== undefined) {
    spots = spots.filter((spot) => (spot.avgPrice ?? 0) <= maxPrice);
  }

  return spots;
};

const Spots = async ({
  searchParams,
}: {
  searchParams: { query?: string; category?: string; price?: string };
}) => {
  const query = searchParams.query || undefined;
  const category = searchParams.category || undefined;
  const maxPrice = searchParams.price
    ? parseInt(searchParams.price, 10)
    : undefined;

  // 필터링된 명소 리스트 가져오기
  const spots = await getFilteredSpots(query, category, maxPrice);

  // 명소 리스트 mock data
  // const spots: Spot[] = [
  //   {
  //     id: 1,
  //     name: "불국사",
  //     category: "landmark",
  //     avgPrice: 10900,
  //     lat: 37.5665,
  //     lng: 126.978,
  //     bookmarkCnt: 130,
  //     tipCnt: 150,
  //     time: "16:00~22:00",
  //     img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
  //   },
  //   {
  //     id: 2,
  //     name: "불국사",
  //     category: "landmark",
  //     avgPrice: 10900,
  //     lat: 37.5665,
  //     lng: 126.978,
  //     bookmarkCnt: 130,
  //     tipCnt: 150,
  //     time: "16:00~22:00",
  //     img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "불국사",
  //     category: "landmark",
  //     avgPrice: 10900,
  //     lat: 37.5665,
  //     lng: 126.978,
  //     bookmarkCnt: 130,
  //     tipCnt: 150,
  //     time: "16:00~22:00",
  //     img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
  //   },
  //   {
  //     id: 4,
  //     name: "불국사",
  //     category: "landmark",
  //     avgPrice: 10900,
  //     lat: 37.5665,
  //     lng: 126.978,
  //     bookmarkCnt: 130,
  //     tipCnt: 150,
  //     time: "16:00~22:00",
  //     img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
  //   },
  //   {
  //     id: 5,
  //     name: "불국사",
  //     category: "landmark",
  //     avgPrice: 10900,
  //     lat: 37.5665,
  //     lng: 126.978,
  //     bookmarkCnt: 130,
  //     tipCnt: 150,
  //     time: "16:00~22:00",
  //     img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
  //   },
  // ];

  return (
    <div>
      {/* 검색 및 필터 UI */}
      <SearchFilter />

      {/* 네이버 지도 */}
      <NaverMap initialSpots={spots} />

      {/* 바텀시트 리스트 */}
      <BottomSheet spots={spots} />
    </div>
  );
};

export default Spots;
