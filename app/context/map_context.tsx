import {
    CellData,
    Image,
    ImageMap,
    ImageType,
} from "@/redux/models/image.model";
import { createContext, useContext, useState } from "react";
import { DEFAULT_CANVAS_SIZE } from "./canvas_context";
import { cloneDeep } from "lodash";

const MAP_DIMENSIONS = 6;
const SCALE = 3.5;

type MapData = {
    imageMap: ImageMap[][];
    setImageMap: (i: ImageMap[][]) => void;
    selectedImage: Image<CellData[][]> | undefined;
    setSelectedImage: (i: Image<CellData[][]>) => void;
    editCoords:
        | {
              x: number;
              y: number;
          }
        | undefined;
    setEditCoords: (c: { x: number; y: number } | undefined) => void;
    eraseMap(): void;
    placeSelectedImage(x: number, y: number): void;
    removeImage(x: number, y: number, index: number): void;
    changeXPosition(x: number, y: number, index: number, value: number): void;
    changeYPosition(x: number, y: number, index: number, value: number): void;
    changeImageType(
        x: number,
        y: number,
        index: number,
        assetType: ImageType
    ): void;
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
        setImageMap(createImageMap());
    }

    // place selected image at given coordinates on map
    function placeSelectedImage(x: number, y: number) {
        if (!selectedImage) return;
        const coords = imageMap[y][x];
        // disregard duplicate images
        if (
            coords.images[coords.images.length - 1] &&
            coords.images[coords.images.length - 1].name === selectedImage.name
        ) {
            return;
        }
        // set image
        const image = cloneDeep(selectedImage);
        image.x = x * DEFAULT_CANVAS_SIZE * SCALE;
        image.y = y * DEFAULT_CANVAS_SIZE * SCALE;
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].images.push(image);
        setImageMap(_imageMap);
    }

    // removes image from the map at given coordinates
    function removeImage(x: number, y: number, index: number) {
        const _imageMap = cloneDeep(imageMap);
        const i = _imageMap[y][x].images.indexOf(_imageMap[y][x].images[index]);
        _imageMap[y][x].images.splice(i, 1);
        setImageMap(_imageMap);
    }

    // changes x position of image at given coordinates for index
    function changeXPosition(
        x: number,
        y: number,
        index: number,
        value: number
    ) {
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].images[index].x = value;
        setImageMap(_imageMap);
    }

    // change y position of image at given coordinates for index
    function changeYPosition(
        x: number,
        y: number,
        index: number,
        value: number
    ) {
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].images[index].y = value;
        setImageMap(_imageMap);
    }

    // changes image type at given coordinates on the map for index
    function changeImageType(
        x: number,
        y: number,
        index: number,
        assetType: ImageType
    ) {
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].images[index].asset_type = assetType;
        setImageMap(_imageMap);
    }

    const initialValue: MapData = {
        imageMap,
        setImageMap,
        selectedImage,
        setSelectedImage,
        editCoords,
        setEditCoords,
        eraseMap,
        placeSelectedImage,
        removeImage,
        changeXPosition,
        changeYPosition,
        changeImageType
    };

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
