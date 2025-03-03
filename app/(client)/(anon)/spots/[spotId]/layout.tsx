import SpotHeader from "./components/SpotHeader";
import styles from "./spotsLayout.module.scss";

const SpotDetailLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { spotId: string };
}) => {
    const { spotId } = params;
    return (
        <div className={styles.layout}>
            <SpotHeader spotId={spotId} />
            {children}
        </div>
    );
};

export default SpotDetailLayout;
