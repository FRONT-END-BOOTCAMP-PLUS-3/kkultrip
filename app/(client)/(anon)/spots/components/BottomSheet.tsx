interface Place {
  id: number;
  name: string;
  category: string;
  price: number;
  lat: number;
  lng: number;
}

export default async function BottomSheet({ places }: { places: Place[] }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: "white",
      }}
    >
      <h2>명소 리스트</h2>
      <div>
        {places.map((place) => (
          <div key={place.id}>
            <h3>{place.name}</h3>
            <p>카테고리: {place.category}</p>
            <p>1인 평균 비용: {place.price}원</p>
          </div>
        ))}
      </div>
    </div>
  );
}
