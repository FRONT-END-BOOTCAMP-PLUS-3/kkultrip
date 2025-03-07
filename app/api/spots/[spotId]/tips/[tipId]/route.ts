import { NextRequest, NextResponse } from "next/server";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { UpdateTipUsecase } from "@/application/usecases/spot/tip/UpdateTipUsecase";
import { GetTipUsecase } from "@/application/usecases/spot/tip/GetTipUsecase";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ spotId: string; tipId: string }> }
) {
    try {
        const params = await props.params;
        const { tipId } = params;

        if (!tipId) {
            return NextResponse.json(
                { error: "Tip ID is required" },
                { status: 400 }
            );
        }

        const tipRepo = new PgTipRepository();
        const imageRepo = new PgImageRepository();
        const getTipWithImagesUsecase = new GetTipUsecase(tipRepo, imageRepo);

        const userId = "d9b78231-1d27-479c-9a28-903bd67433e6";
        const tip = await getTipWithImagesUsecase.execute(Number(tipId));

        if (!tip) {
            return NextResponse.json(
                { error: "해당 팁을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        if (tip.userId !== userId) {
            return NextResponse.json(
                { error: "본인이 작성한 팁만 수정할 수 있습니다." },
                { status: 403 }
            );
        }

        return NextResponse.json(tip, { status: 200 });
    } catch (error) {
        console.error("❌ 팁 불러오기에 실패했습니다 :", error);
        return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        // URL에서 tipId 추출
        const urlParts = req.nextUrl.pathname.split("/");
        const tipId = urlParts[urlParts.length - 1]; // 마지막 경로값이 tipId

        if (!tipId) {
            return NextResponse.json(
                { error: "Tip ID is required" },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const waitingTime = Number(formData.get("waitingTime"));
        const newImageFiles = formData.getAll("images") as File[];
        const existingImagePaths = formData.getAll(
            "existingImages"
        ) as string[];

        const tipRepo = new PgTipRepository();
        const imageRepo = new PgImageRepository();
        const spotRepo = new PgSpotRepository();
        const updateTipUsecase = new UpdateTipUsecase(
            tipRepo,
            imageRepo,
            spotRepo
        );

        await updateTipUsecase.execute({
            tipId: parseInt(tipId),
            description,
            price,
            waitingTime,
            newImageFiles,
            existingImagePaths,
        });

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error("❌ 팁 업데이트 오류:", error);
        return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
    }
}
