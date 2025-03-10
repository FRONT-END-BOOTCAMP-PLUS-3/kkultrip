import SpotNav from "./SpotNav";
import Image from "next/image";
import styles from "./SpotHeader.module.scss";
import { SpotHeaderDto } from "@/application/usecases/spot/dto/SpotHeaderDto";
import BookMark from "./BookMark";
import { cookies } from "next/headers";

const SpotHeader = async ({ spotId }: { spotId: string }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${spotId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${token}`, 
            },
            cache: "no-store",
        }
    );

    const spotHeaderData: SpotHeaderDto | null = await data.json();

    if (!spotHeaderData) {
        return <div>Spot not found</div>;
    }

    return (
        <>
            <Image
                src={spotHeaderData.img}
                alt={spotHeaderData.name}
                width={100}
                height={100}
                className={styles.spotImage}
                priority
            />
            <div className={styles.spotContainer}>
                <div className={styles.spotHeader}>
                    <div className={styles.spotTitle}>
                        <h1>{spotHeaderData.name}</h1>
                        <p>{spotHeaderData.category}</p>
                    </div>
                    <BookMark
                        isBookMarked={spotHeaderData.isBookMarked}
                        spotId={Number(spotId)}
                    />
                </div>
                <SpotNav spotId={spotId} />
            </div>
        </>
    );
};

export default SpotHeader;
