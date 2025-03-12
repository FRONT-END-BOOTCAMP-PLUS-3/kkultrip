import Image from "next/image";
import Link from "next/link";
import styles from "./SpotImage.module.scss";
import { TipImageDto } from "@/application/usecases/spot/tips/dto/TipImageDto";

const SpotImage = ({
    image,
    spotId,
}: {
    image: TipImageDto;
    spotId: string;
}) => {
    return (
        <Link href={`/spots/${spotId}/tips?sort=latest#${image.tipId}`}>
            <Image
                src={`${process.env.SERVICE_URL}${image.path}`}
                alt="image"
                width={100}
                height={100}
                className={styles.spotImage}
                unoptimized
            />
        </Link>
    );
};

export default SpotImage;
