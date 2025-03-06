import Image from "next/image";
import styles from "./Tip.module.scss";
import { SpotTipDto } from "@/application/usecases/spot/tips/dto/SpotTipDto";
import TipImage from "./TipImage";
import TipButton from "./TipButton";

const Tip = ({ tip }: { tip: SpotTipDto }) => {
    console.log(tip);

    const accessUserId = "7379a017-90cb-40da-9635-eb7eff4d8e83";


    return (
        <div className={styles.tipContainer}>
            <h3 className={styles.srOnly}>{tip.userName}의 꿀팁</h3>
            <div className={styles.profileWrapper}>
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
                {tip.userId === accessUserId && (
                    <TipButton tipId={tip.id} spotId={tip.spotId} />
                )}
            </div>

            {tip.tipImages.length > 0 && (
                <TipImage image={tip.tipImages} name={tip.spotName} />
            )}

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
            <p>{tip.description}</p>
        </div>
    );
};

export default Tip;
