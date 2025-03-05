import Image from "next/image";
import styles from "./Tip.module.scss";
import { SpotTipDto } from "@/application/usecases/spot/dto/SpotTipDto";

const Tip = ({ tip }: { tip: SpotTipDto }) => {
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
            <div className={styles.costWrapper}>
                <div className={styles.costBox}>
                    <p className={styles.costTitle}>1인 평균 비용</p>
                    <p className={styles.cost}>{tip.price}원</p>
                </div>
                <p className={styles.createdAt}>{tip.createdAt}</p>
            </div>
            <p>{tip.description}</p>
        </div>
    );
};

export default Tip;
