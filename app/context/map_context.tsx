import { CellData, Image, ImageMap } from "@/redux/models/image.model";
import { createContext, useContext, useState } from "react";
import { DEFAULT_CANVAS_SIZE } from "./canvas_context";

const MAP_DIMENSIONS = 6;
const SCALE = 3.5;

type MapData = {
    imageMap: ImageMap[][];
    setImageMap: (i: ImageMap[][]) => void;
    selectedImage: Image<CellData[][]> | undefined;
    setSelectedImage: (i: Image<CellData[][]>) => void;
    editCoords: {
        x: number;
        y: number;
    } | undefined;
    setEditCoords: (c: {x: number, y: number} | undefined) => void;
    eraseMap(): void;
};

const MapContext = createContext<MapData | undefined>(undefined);

export default function MapsProvider({ children }: React.PropsWithChildren) {
    const [imageMap, setImageMap] = useState<ImageMap[][]>(createImageMap());
    const [selectedImage, setSelectedImage] = useState<
        Image<CellData[][]> | undefined
    >();
    const [editCoords, setEditCoords] = useState<
        { x: number; y: number } | undefined
    >();

    const initialValue: MapData = {
        imageMap,
        setImageMap,
        selectedImage,
        setSelectedImage,
        editCoords,
        setEditCoords,
        eraseMap
    };

    // create empty image map
    function createImageMap() {
        const newMap: ImageMap[][] = [];
        for (let y = 0; y < MAP_DIMENSIONS; y++) {
            newMap.push([]);
            for (let x = 0; x < MAP_DIMENSIONS; x++) {
                newMap[y].push({
                    name: "untitled",
                    images: [],
                    x: x * DEFAULT_CANVAS_SIZE * SCALE,
                    y: y * DEFAULT_CANVAS_SIZE * SCALE,
                    mapX: x,
                    mapY: y,
                });
            }
        }
        return newMap;
    }

    function eraseMap() {
        setImageMap(createImageMap())
    }

    return (
        <MapContext.Provider value={initialValue}>
            {children}
        </MapContext.Provider>
    );
}

export function useMaps() {
    const context = useContext(MapContext);
    if (context === undefined) {
        throw new Error("useMaps must be used within a MapsProvider");
    }
    return context;
}
