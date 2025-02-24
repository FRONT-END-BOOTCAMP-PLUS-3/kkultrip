import NaverMap from "./components/NaverMap";
import BottomSheet from "./components/BottomSheet";

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

// ✅ 서버에서 명소 데이터를 가져오는 함수
// async function getPlaces(): Promise<Place[]> {
//   const res = await fetch("https://api.example.com/places", { cache: "no-store" });
//   return res.json();
// }

const Spots = async () => {
  // const places = await getPlaces(); // ✅ 서버에서 데이터 가져오기 (SEO 가능)

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
      <NaverMap spots={spots} />
      <BottomSheet spots={spots} />
    </div>
  );
};
export default Spots;
