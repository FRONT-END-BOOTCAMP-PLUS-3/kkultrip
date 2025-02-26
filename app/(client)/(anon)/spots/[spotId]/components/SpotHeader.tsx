import SpotNav from "./SpotNav";
import Image from "next/image";
import styles from "./spotHeader.module.scss";
import { FaRegBookmark } from "react-icons/fa";

const SpotHeader = async ({ spotId }: { spotId: string }) => {
    const data = await fetch(`http://localhost:3000/api/spots/${spotId}`);
    const spotHeaderData = await data.json();
    return (
        <>
            <Image
                src={spotHeaderData.img}
                alt="불국사"
                width={100}
                height={100}
                className={styles.spotImage}
            />
            <div className={styles.spotContainer}>
                <div className={styles.spotHeader}>
                    <div className={styles.spotTitle}>
                        <h1>{spotHeaderData.name}</h1>
                        <p>{spotHeaderData.category}</p>
                    </div>
                    <button className={styles.bookmarkButton}>
                        <FaRegBookmark size={24} color="var(--primary-color)" />
                    </button>
                </div>
                <SpotNav spotId={spotId} />
            </div>
        </>
    );
};

export default SpotHeader;
