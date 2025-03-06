import { SpotTipDto } from "@/application/usecases/spot/tips/dto/SpotTipDto";
import Link from "next/link";
import CreateTip from "./components/CreateTip";
import Reaction from "./components/Reaction";
import Tip from "./components/Tip";
import styles from "./TipsPage.module.scss";

const TipsPage = async (props: {
  params: Promise<{ spotId: string }>;
  searchParams: Promise<{ sort?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { spotId } = params;
  const sort = searchParams.sort || "latest";

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${spotId}/tips?sort=${sort}`
  );
  const tipList: SpotTipDto[] = await data.json();

    if (!tipList || tipList.length === 0) {
        return (
            <div className={styles.noData}>
                <p>작성된 꿀팁이 없습니다.</p>
                <p>첫 번째 꿀팁을 작성해볼까요?</p>
                <CreateTip spotId={spotId} />
            </div>
        );
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
                    <Reaction
                        tipReaction={tip.tipReaction}
                        userId={tip.userId}
                        tipId={tip.id}
                    />
                </div>
            ))}

            <CreateTip spotId={spotId} />
        </div>
    );
};

export default TipsPage;
