import { TipImageDto } from "@/application/usecases/spot/tips/dto/TipImageDto";
import Image from "next/image";
import styles from "./TipImage.module.scss";

const TipImage = (props: { image: TipImageDto[]; name: string }) => {
  return (
    <div className={styles.imageContainer}>
      {props.image.map((image) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVICE_URL}${image.path}`}
          alt={props.name}
          key={image.id}
          className={styles.image}
          width={100}
          height={100}
          unoptimized
        />
      ))}
    </div>
  );
};

export default TipImage;
