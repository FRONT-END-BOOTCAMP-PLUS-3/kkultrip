import Link from "next/link";
import Tip from "./components/Tip";
import styles from "./tipsPage.module.scss";
import Reaction from "./components/Reaction";

const TipsPage = async ({ params }: { params: { spotId: string } }) => {
    const { spotId } = params;

    return (
        <div className={styles.tipsContainer}>
            <h2 className={styles.srOnly}>불국사 꿀팁</h2>
            <ul className={styles.sortContainer}>
                <li>
                    <button>
                        <Link
                            href={`/spots/${spotId}/tips?sort=latest`}
                            className={styles.link}
                        >
                            • 최신순
                        </Link>
                    </button>
                </li>
                <li>
                    <button>
                        <Link
                            href={`/spots/${spotId}/tips?sort=reaction`}
                            className={styles.link}
                        >
                            • 반응순
                        </Link>
                    </button>
                </li>
            </ul>
            
            <div className={styles.tipContainer}>
                <Tip />
                <Reaction />
            </div>
            <div className={styles.tipContainer}>
                <Tip />
                <Reaction />
            </div>
            <div className={styles.tipContainer}>
                <Tip />
                <Reaction />
            </div>
            <div className={styles.tipContainer}>
                <Tip />
                <Reaction />
            </div>
            <div className={styles.tipContainer}>
                <Tip />
                <Reaction />
            </div>
            <div className={styles.tipContainer}>
                <Tip />
                <Reaction />
            </div>
            <div className={styles.tipContainer}>
                <Tip />
                <Reaction />
            </div>
        </div>
    );
};

export default TipsPage;
