
export interface AppLinkRequest<T> {
    imageTopTile?: string;
    imageMainLine: string;
    imageSecondLine: string;
    message: string;
    data: T;
}