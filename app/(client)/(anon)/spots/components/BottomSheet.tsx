import styles from "./BottomSheet.module.scss";
import DraggableBottomSheet from "./DraggableBottomSheet";

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

export default function BottomSheet({ spots }: { spots: Spot[] }) {
  return (
    <div className={styles.bottomSheetContainer}>
      <div className={styles.hiddenSEO}>
        {spots.map((spot) => (
          <div key={spot.id} className={styles.spotSEO}>
            <h3>{spot.name}</h3>
            <p className={styles.category}>{spot.category}</p>
            <p className={styles.location}>
              {spot.lat}, {spot.lng}
            </p>
            <p className={styles.details}> {spot.bookmarkCnt || 0}</p>
            <p className={styles.price}>
              {spot.avgPrice?.toLocaleString() || "정보 없음"}원
            </p>
          </div>
        ))}
      </div>

      {/* 🚀 CSR에서 드래그 기능을 담당 */}
      <DraggableBottomSheet spots={spots} />
    </div>
  );
}
