import SpotImage from "./components/SpotImage";
import styles from "./ImagePage.module.scss";
import { TipImageDto } from "@/application/usecases/spot/tips/dto/TipImageDto";
import Link from "next/link";

const ImagesPage = async (props: { params: Promise<{ spotId: string }> }) => {
    const params = await props.params;
    const spotId = params.spotId;

    const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${spotId}/images`
    );
    const images: TipImageDto[] = await data.json();

    console.log(images);

    if (images.length === 0) {
        return (
            <div className={styles.noData}>
                <p>등록된 이미지가 없습니다.</p>
                <p>첫 번째 이미지를 등록해볼까요?</p>
                <Link href={`/spots/${spotId}/tips`} className={styles.link}>
                    꿀팁 작성하기
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.imageContainer}>
            {images.map((image) => (
                <SpotImage key={image.id} image={image} spotId={spotId} />
            ))}
        </div>
    );
};

export default ImagesPage;
