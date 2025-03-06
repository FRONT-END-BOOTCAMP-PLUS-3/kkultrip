import TipForm from "../components/TipForm";

const CreatePage = async ({ params }: { params: { spotId: string } }) => {
  const { spotId } = await params;
  return <TipForm isEdit={false} spotId={spotId} />;
};

export default CreatePage;
