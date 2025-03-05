import SpotHeader from "./components/SpotHeader";
import styles from "./spotsLayout.module.scss";
import { headers } from "next/headers";

const SpotDetailLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { spotId: string };
}) => {
  const { spotId } = await params;
  const headersList = await headers();
  const headerPathname = headersList.get("x-pathname") || "";

  if (headerPathname.includes("edit") || headerPathname.includes("create")) {
    return <div className={styles.layout}>{children}</div>;
  } else {
    return (
      <div className={styles.layout}>
        <SpotHeader spotId={spotId} />
        {children}
      </div>
    );
  }
};

export default SpotDetailLayout;
