import SpotHeader from "./components/SpotHeader";
import styles from "./spotsLayout.module.scss";

const SpotDetailLayout = async (
    props: {
        children: React.ReactNode;
        params: Promise<{ spotId: string }>;
    }
) => {
    const params = await props.params;

    const {
        children
    } = props;

    const { spotId } = params;
    return (
        <div className={styles.layout}>
            <SpotHeader spotId={spotId} />
            {children}
        </div>
    );
};

export default SpotDetailLayout;
