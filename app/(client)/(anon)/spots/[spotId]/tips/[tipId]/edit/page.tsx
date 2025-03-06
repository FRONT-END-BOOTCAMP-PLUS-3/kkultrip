import TipForm from "../../components/TipForm";

const EditPage = async ({
  params,
}: {
  params: { spotId: string; tipId: string };
}) => {
  const { spotId, tipId } = await params;
  return <TipForm isEdit={true} spotId={spotId} tipId={tipId} />;
};

export default EditPage;
