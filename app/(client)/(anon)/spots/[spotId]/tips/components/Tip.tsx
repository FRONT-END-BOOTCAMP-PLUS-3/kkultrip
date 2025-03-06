import Image from "next/image";
import styles from "./Tip.module.scss";
import { SpotTipDto } from "@/application/usecases/spot/tips/dto/SpotTipDto";
import TipImage from "./TipImage";

const Tip = ({ tip }: { tip: SpotTipDto }) => {
  console.log(tip);
    return (
        <div className={styles.tipContainer}>
            <h3 className={styles.srOnly}>{tip.userName}의 꿀팁</h3>
            <figure className={styles.profileWrapper}>
                <Image
                    src={tip.profileImage}
                    alt="사용자 이름의 프로필 사진"
                    width={36}
                    height={36}
                    className={styles.imageBorder}
                />
                <figcaption>
                    <h4>{tip.userName}</h4>
                </figcaption>
            </figure>
            <TipImage image={tip.tipImages} name={tip.spotName} />

            <div className={styles.costWrapper}>
                <div className={styles.costBox}>
                    <p className={styles.costTitle}>1인 평균 비용</p>
                    <p className={styles.cost}>{tip.price}원</p>
                </div>
                <div className={styles.waitingTimeWrapper}>
                    <p className={styles.waitingTimeTitle}>대기 시간</p>
                    <p className={styles.waitingTime}>{tip.waitingTime}분</p>
                </div>
                <p className={styles.createdAt}>{tip.createdAt}</p>
            </div>
            <p>{tip.description}</p>
        </div>
    );
};

export default Tip;
