export type MapDTO<T> = {
    _id?: string;
    user_id: string;
    name: string;
    // main entry point of player on map
    entrance: {
        x: number,
        y: number
    },
    // points on map which are portals to other maps
    portals: MapPortal[],
    data: T
}

export type MapPortal = {
    map_id: string;
    x: number;
    y: number;
}

