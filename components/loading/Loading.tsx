import { ClipLoader } from "react-spinners";
import styles from "./Loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <ClipLoader size={60} color="#fdbb09" />
    </div>
  );
};

export default Loading;
