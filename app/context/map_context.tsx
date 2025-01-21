import { ImageMap } from "@/redux/models/image.model";
import { createContext, useState } from "react"
import { DEFAULT_CANVAS_SIZE } from "./canvas_context";

const MAP_DIMENSIONS = 6;
const SCALE = 3.5;

type MapData = {

}

const MapContext = createContext<MapData | undefined>(undefined);

export default function MapProvider({children}: React.PropsWithChildren) {
    const [imageMap, setImageMap] = useState<ImageMap[][]>(createImageMap());
    const initialValue: MapData ={}

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

    return (
        <MapContext.Provider value={initialValue}>
            {children}
        </MapContext.Provider>
    )
}