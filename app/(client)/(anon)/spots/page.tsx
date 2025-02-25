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
  category?: string,
  maxPrice?: number
): Promise<Spot[]> => {
  // ✅ 내 위치 기준 1km 이내 명소 가져오기
  const userLat = 37.5665; // 예제: 실제 유저 위치 적용 필요
  const userLng = 126.978;

  const res = await fetch(
    `https://api.example.com/spots?lat=${userLat}&lng=${userLng}&radius=1000`,
    { cache: "no-store" }
  );
  let spots: Spot[] = await res.json();

  // ✅ 카테고리 필터링
  if (category) {
    spots = spots.filter((spot) => spot.category === category);
  }

  // ✅ 가격 필터링 (선택한 금액 이하)
  if (maxPrice !== undefined) {
    spots = spots.filter((spot) => (spot.avgPrice ?? 0) <= maxPrice);
  }

  return spots;
};

const Spots = async ({
  searchParams,
}: {
  searchParams: { category?: string; price?: string };
}) => {
  const category = searchParams.category || undefined;
  const maxPrice = searchParams.price
    ? parseInt(searchParams.price, 10)
    : undefined;

  // ✅ 필터링된 명소 리스트 가져오기
  // const spots = await getFilteredSpots(category, maxPrice);
  const spots: Spot[] = [
    {
      id: 1,
      name: "불국사",
      category: "landmark",
      avgPrice: 10900,
      lat: 37.5665,
      lng: 126.978,
      bookmarkCnt: 130,
      tipCnt: 150,
      time: "16:00~22:00",
      img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
    },
    {
      id: 2,
      name: "불국사",
      category: "landmark",
      avgPrice: 10900,
      lat: 37.5665,
      lng: 126.978,
      bookmarkCnt: 130,
      tipCnt: 150,
      time: "16:00~22:00",
      img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
    },
    {
      id: 3,
      name: "불국사",
      category: "landmark",
      avgPrice: 10900,
      lat: 37.5665,
      lng: 126.978,
      bookmarkCnt: 130,
      tipCnt: 150,
      time: "16:00~22:00",
      img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
    },
    {
      id: 4,
      name: "불국사",
      category: "landmark",
      avgPrice: 10900,
      lat: 37.5665,
      lng: 126.978,
      bookmarkCnt: 130,
      tipCnt: 150,
      time: "16:00~22:00",
      img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
    },
    {
      id: 5,
      name: "불국사",
      category: "landmark",
      avgPrice: 10900,
      lat: 37.5665,
      lng: 126.978,
      bookmarkCnt: 130,
      tipCnt: 150,
      time: "16:00~22:00",
      img: "https://www.gyeongju.go.kr/upload/content/thumb/20191221/EE09467CAC7043D9969AD488AB8BC662.jpg",
    },
  ];

  return (
    <div>
      {/* 검색 및 필터 UI */}
      <SearchFilter />

      {/* 네이버 지도 */}
      <NaverMap spots={spots} />

      {/* 바텀시트 리스트 */}
      <BottomSheet spots={spots} />
    </div>
  );
};

export default Spots;
