import styles from "./BottomSheet.module.scss";
import DraggableBottomSheet from "./DraggableBottomSheet";
import { GetSpotsDTO } from "@/application/usecases/spot/dto/GetSpotsDto";

const BottomSheet = ({ spots }: { spots: GetSpotsDTO[] }) => {
  return (
    <div className={styles.bottomSheetContainer}>
      {/* ✅ SEO 최적화용 숨겨진 바텀시트 (SSR에서만 출력됨) */}
      <div className={styles.hiddenSEO}>
        {spots.map((spot) => (
          <div key={spot.id} className={styles.spotSEO}>
            <h3>{spot.name}</h3>
            <p className={styles.category}>{spot.category}</p>
            <p className={styles.location}>
              {spot.lat}, {spot.lon}
            </p>
            <p className={styles.details}>북마크 {spot.bookmarkCnt || 0}개</p>
            <p className={styles.price}>
              {spot.avgPrice
                ? `${spot.avgPrice.toLocaleString()}원`
                : "가격 정보 없음"}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ CSR에서 동작하는 바텀시트 */}
      <DraggableBottomSheet spots={spots} />
    </div>
  );
};

export default BottomSheet;
