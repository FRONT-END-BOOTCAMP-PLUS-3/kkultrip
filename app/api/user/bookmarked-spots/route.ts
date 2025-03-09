import { GetBookmarkedSpotsUsecase } from "@/application/usecases/user/GetBookmarkedSpotsUsecase";
import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { PgBookmarkRepository } from "@/infrastructure/repositories/PgBookmarkRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { GetUserInfoByJWT } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const jwtData = await GetUserInfoByJWT(token);
    if (!jwtData) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = jwtData.userId as string;

    const bookmarkRepository: BookmarkRepository = new PgBookmarkRepository();
    const spotRepository: SpotRepository = new PgSpotRepository();

    const bookmarkedSpotsUseCase = new GetBookmarkedSpotsUsecase(
      bookmarkRepository,
      spotRepository
    );
    const bookmarkedSpotList = await bookmarkedSpotsUseCase.execute(userId);

    if (!bookmarkedSpotList) {
      return NextResponse.json(
        { error: "UserTips not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ bookmarkedSpotList }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "BookmarkedSpots not found" },
      { status: 404 }
    );
  }
}
