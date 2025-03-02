import Link from "next/link";
import Reaction from "./components/Reaction";
import Tip from "./components/Tip";
import styles from "./tipsPage.module.scss";

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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${spotId}/tip`
    );
    const tipData = await data.json();

    console.log(tipData);
  
    return (
        <div className={styles.tipsContainer}>
            <h2 className={styles.srOnly}>불국사 꿀팁</h2>
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
                            className={`${styles.link} ${sort === "reaction" ? styles.activeLink : ""}`}
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
