import Image from "next/image";
import styles from "./Tip.module.scss";
import { SpotTipDto } from "@/application/usecases/spot/tips/dto/SpotTipDto";
import TipImage from "./TipImage";
import TipButton from "./TipButton";

const Tip = ({ tip }: { tip: SpotTipDto }) => {
  return (
    <div id={tip.id.toString()} className={styles.tipContainer}>
      <h3 className={styles.srOnly}>{tip.userName}의 꿀팁</h3>
      <div className={styles.profileWrapper}>
        <figure className={styles.profileWrapper}>
          <Image
            src={`${process.env.NEXT_PUBLIC_SERVICE_URL}${tip.profileImage}`}
            alt="사용자 이름의 프로필 사진"
            width={36}
            height={36}
            className={styles.imageBorder}
            unoptimized
          />
          <figcaption>
            <h4>{tip.userName}</h4>
          </figcaption>
        </figure>

        <TipButton tipId={tip.id} spotId={tip.spotId} nickName={tip.userName} />
      </div>

      <div className={styles.costWrapper}>
        <div className={styles.costBox}>
          <p className={styles.costTitle}>1인 평균 비용</p>
          <p className={styles.cost}>
            {Number(tip.price) === 0 ? "무료" : `${tip.price}원`}
          </p>
        </div>
        <div className={styles.waitingTimeWrapper}>
          <p className={styles.waitingTimeTitle}>대기 시간</p>
          <p className={styles.waitingTime}>
            {Number(tip.waitingTime) === 0
              ? "바로 입장"
              : `${tip.waitingTime}분`}
          </p>
        </div>
        <p className={styles.createdAt}>{tip.createdAt}</p>
      </div>

      {tip.tipImages.length > 0 && (
        <TipImage image={tip.tipImages} name={tip.spotName} />
      )}

      <p className={styles.description}>{tip.description}</p>
    </div>
  );
};

export default Tip;
