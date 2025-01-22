export type ImageType = "tile" | "object" | "portal" | "player_up" | "player_down" | "player_left" | "player_right"
 
export type Image<T> = {
    _id?: string;
    user_id: string;
    name: string;
    asset_type?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    data: T;
}

export type CellData = {
    x: number;
    y: number;
    color: string;
    r?: number;
    g?: number;
    b?: number;
    a?: number;
};


export type ImageMap = {
    name: string;
    images: Image<CellData[][]>[];
    x: number;
    y: number;
    mapX: number;
    mapY: number;
};