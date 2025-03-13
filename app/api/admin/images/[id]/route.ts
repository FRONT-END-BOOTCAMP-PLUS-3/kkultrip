import { NextRequest, NextResponse } from "next/server";
import DeleteImageUseCase from "@/application/usecases/spot/images/DeleteImageUseCase";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";

export async function DELETE(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;
    const imageId = pathname.split("/").pop();

    if (!imageId || isNaN(Number(imageId))) {
      return NextResponse.json(
        { error: "유효하지 않은 이미지 ID입니다." },
        { status: 400 }
      );
    }

    const imageRepository = new PgImageRepository();
    const deleteImageUseCase = new DeleteImageUseCase(imageRepository);
    await deleteImageUseCase.execute(Number(imageId));

    return NextResponse.json(
      { message: "이미지가 성공적으로 삭제되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "이미지 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
