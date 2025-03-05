import SpotImage from "./components/SpotImage";
import styles from "./ImagePage.module.scss";

const ImagesPage = () => {
  return <div className={styles.imageContainer}>
    <SpotImage />
    <SpotImage />
    <SpotImage />
    <SpotImage />
    <SpotImage />
  </div>;
};

export default ImagesPage;
