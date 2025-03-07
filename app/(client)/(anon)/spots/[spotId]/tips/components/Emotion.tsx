"use client";

import styles from "./Emotion.module.scss";
import Image from "next/image";

const Emotion = ({ count, type }: { count: number; type: number }) => {
    const getImageData = (type: number) => {
        switch (type) {
            case 1:
                return { src: "/images/reaction-type1.png", alt: "유용하네요" };
            case 2:
                return { src: "/images/reaction-type2.png", alt: "가고싶어요" };
            case 3:
                return { src: "/images/reaction-type3.png", alt: "실망이에요" };
            case 4:
                return { src: "/images/reaction-type4.png", alt: "재미있어요" };
            default:
                throw new Error(`Invalid type: ${type}`);
        }
    };

    const { src, alt } = getImageData(type);

    return (
        <div className={styles.emotionContainer}>
            <Image src={src} alt={alt} width={20} height={20} />
            <p>{count}</p>
        </div>
    );
};
export default Emotion;
