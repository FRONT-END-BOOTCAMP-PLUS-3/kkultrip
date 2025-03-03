import Link from "next/link";
import Reaction from "./components/Reaction";
import Tip from "./components/Tip";
import styles from "./tipsPage.module.scss";
import { SpotTipDto } from "@/application/usecases/spot/dto/SpotTipDto";

const TipsPage = async ({
    params,
    searchParams,
}: {
    params: { spotId: string };
    searchParams: { sort?: string };
}) => {
    const { spotId } = params;
    const sort = searchParams.sort || "latest";

    const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${spotId}/tips?sort=${sort}`
    );
    const tipList: SpotTipDto[] = await data.json();

    if (!tipList) {
        return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
    }

    return (
        <div className={styles.tipsContainer}>
            <h2 className={styles.srOnly}>{tipList[0].spotName} 꿀팁</h2>
            <ul className={styles.sortContainer}>
                <li>
                    <button>
                        <Link
                            href={`/spots/${spotId}/tips?sort=latest`}
                            className={`${styles.link} ${
                                sort === "latest" ? styles.activeLink : ""
                            }`}
                        >
                            • 최신순
                        </Link>
                    </button>
                </li>
                <li>
                    <button>
                        <Link
                            href={`/spots/${spotId}/tips?sort=reaction`}
                            className={`${styles.link} ${
                                sort === "reaction" ? styles.activeLink : ""
                            }`}
                        >
                            • 반응순
                        </Link>
                    </button>
                </li>
            </ul>

            {tipList.map((tip) => (
                <div className={styles.tipContainer} key={tip.id}>
                    <Tip tip={tip} />
                    <Reaction tipReaction={tip.tipReaction} />
                </div>
            ))}
        </div>
    );
};

export default TipsPage;
