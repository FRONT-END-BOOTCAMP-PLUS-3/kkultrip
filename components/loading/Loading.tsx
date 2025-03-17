import { MoonLoader } from "react-spinners";
import styles from "./Loading.module.scss";

const Loading = (props: { color: string; size: number }) => {
  const { color, size } = props;
  return (
    <div className={styles.loadingContainer}>
      <MoonLoader size={size} color={color} />
    </div>
  );
};

export default Loading;
