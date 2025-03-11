import SpotNav from "./SpotNav";
import Image from "next/image";
import styles from "./SpotHeader.module.scss";
import { SpotHeaderDto } from "@/application/usecases/spot/dto/SpotHeaderDto";
import BookMark from "./BookMark";
import { cookies } from "next/headers";

const SpotHeader = async ({ spotId }: { spotId: string }) => {
    try {
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

        if (data.status !== 200) {
            return (
                <div className={styles.errorContainer}>
                    <Image
                        src="/images/error.png"
                        alt="error"
                        width={100}
                        height={100}
                        className={styles.errorImage}
                        priority
                    />
                    <span className={styles.errorText}>{data.status}</span>
                    <span>서버에 문제가 있습니다.</span>
                    <span>잠시 후 다시 시도해주세요.</span>
                </div>
            );
        }

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
    } catch (error) {
        console.error("Error fetching spot header:", error);
        return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    }
};

export default SpotHeader;
