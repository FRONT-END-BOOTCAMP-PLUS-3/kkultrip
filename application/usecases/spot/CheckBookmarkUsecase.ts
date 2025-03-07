import BookmarkRepository from "@/domain/repositories/BookmarkRepository";

export default class CheckBookmarkUsecase {
    constructor(private bookmarkRepository: BookmarkRepository) {}

    async execute(spotId: number, userId: string): Promise<boolean> {
        return this.bookmarkRepository.checkBookmark(spotId, userId);
    }
}
