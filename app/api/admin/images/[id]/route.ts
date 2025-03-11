import { NextResponse } from "next/server";
import DeleteImageUseCase from "@/application/usecases/spot/images/DeleteImageUseCase";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const imageRepository = new PgImageRepository();
  const deleteImageUseCase = new DeleteImageUseCase(imageRepository);
  try {
    const id = params.id;

    await deleteImageUseCase.execute(Number(id));

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
