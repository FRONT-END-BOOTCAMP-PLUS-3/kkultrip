import NaverMap from "./components/NaverMap";
import BottomSheet from "./components/BottomSheet";

interface Place {
  id: number;
  name: string;
  category: string;
  price: number;
  lat: number;
  lng: number;
}

// ✅ 서버에서 명소 데이터를 가져오는 함수
// async function getPlaces(): Promise<Place[]> {
//   const res = await fetch("https://api.example.com/places", { cache: "no-store" });
//   return res.json();
// }

const Spots = async () => {
  // const places = await getPlaces(); // ✅ 서버에서 데이터 가져오기 (SEO 가능)

  const places: Place[] = [
    {
      id: 1,
      name: "경복궁",
      category: "landmark",
      price: 3000,
      lat: 37.579617,
      lng: 126.977041,
    },
    {
      id: 2,
      name: "남산 타워",
      category: "landmark",
      price: 10000,
      lat: 37.551169,
      lng: 126.988227,
    },
  ];
  return (
    <div>
      <h1>명소 리스트</h1>
      {/* <NaverMap places={places} /> */}
      <NaverMap places={places} />
      <BottomSheet places={places} />
    </div>
  );
};
export default Spots;
