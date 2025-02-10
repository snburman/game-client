import {
    CellData,
    Image,
    ImageMap,
    ImageType,
} from "@/redux/models/image.model";
import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CANVAS_SIZE, DEFAULT_NAME } from "./canvas_context";
import { cloneDeep } from "lodash";
import { useAuth } from "./auth_context";
import {
    MapError,
    useLazyGetUserMapsQuery,
    usePostMapMutation,
    useUpdateMapMutation,
} from "@/redux/map.slice";
import { MapDTO } from "@/redux/models/map.model";
import { useModals } from "./modal_context";

const MAP_DIMENSIONS = 6;
const SCALE = 3.5;

type MapData = {
    getMaps(): Promise<void>;
    loadMap: (id: string) => Promise<void>;
    saveMap(): Promise<void>;
    allMaps: MapDTO<Image<CellData[][]>[]>[] | undefined;
    name: string;
    setName: (n: string) => void;
    primary: boolean;
    setPrimary: (p: boolean) => void;
    entrance: {
        x: number;
        y: number;
    };
    setEntrance: (e: { x: number; y: number }) => void;
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
    const { token, user } = useAuth();
    const { setConfirmModal, setMessageModal } = useModals();

    // API
    const [postMap] = usePostMapMutation();
    const [updateMap] = useUpdateMapMutation();
    const [getUserMaps] = useLazyGetUserMapsQuery();
    const [imageMap, setImageMap] = useState<ImageMap[][]>(createImageMap());
    const [allMaps, setAllMaps] = useState<MapDTO<Image<CellData[][]>[]>[]>();

    // current map values
    const [name, setName] = useState<string>("");
    const [primary, setPrimary] = useState<boolean>(false);
    //TODO: user must select entrance
    const [entrance, setEntrance] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    // selected image to place on map
    const [selectedImage, setSelectedImage] = useState<
        Image<CellData[][]> | undefined
    >();
    // coordinates of current cell being edited
    const [editCoords, setEditCoords] = useState<
        { x: number; y: number } | undefined
    >();

    // fetch user maps on login
    useEffect(() => {
        token && getMaps();
    }, [token]);

    async function getMaps() {
        if (!token) return;
        getUserMaps(token).then((res) => {
            if (res.error) {
                setMessageModal("Error retrieving maps");
            } else {
                setAllMaps(res.data);
            }
        });
    }

    // create empty image map
    function createImageMap() {
        const newMap: ImageMap[][] = [];
        for (let y = 0; y < MAP_DIMENSIONS; y++) {
            newMap.push([]);
            for (let x = 0; x < MAP_DIMENSIONS; x++) {
                newMap[y].push({
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

    // erases all images from map
    function eraseMap() {
        setImageMap(createImageMap());
        setEntrance({ x: 0, y: 0 });
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
    // load map from cache by ID
    async function loadMap(id: string) {
        const _map = allMaps?.find((m) => m._id === id);
        if (!_map) return;
        const _imageMap = createImageMap();
        const images = cloneDeep(_map.data);
        images.forEach((image) => {
            // convert image.x, y to imageMap.mapX, mapY
            // either 0, 56, 112, 168, 224, 280
            const x = image.x / (DEFAULT_CANVAS_SIZE * SCALE);
            const y = image.y / (DEFAULT_CANVAS_SIZE * SCALE);
            const mapX = Math.floor(x % MAP_DIMENSIONS);
            const mapY = Math.floor(y % MAP_DIMENSIONS);
            _imageMap[mapY][mapX].images.push(image);
        });
        setImageMap(_imageMap);
        setName(_map.name);
        setPrimary(_map.primary);
        const entranceX = Math.floor(_map.entrance.x / (DEFAULT_CANVAS_SIZE * SCALE));
        const entranceY = Math.floor(_map.entrance.y / (DEFAULT_CANVAS_SIZE * SCALE));
        setEntrance({ x: entranceX, y: entranceY });
    }

    // API calls
    async function saveMap() {
        if (!user?._id || !token) return;

        // copy images in order from all arrays
        let images: Image<CellData[][]>[] = [];
        imageMap.forEach((arr) => {
            arr.forEach((im) => {
                images = [...images, ...im.images];
            });
        });

        const _name = name === "" ? DEFAULT_NAME : name;
        // convert entrance to expected format for wasm
        const _entrance = {
            x: entrance.x * DEFAULT_CANVAS_SIZE * SCALE,
            y: entrance.y * DEFAULT_CANVAS_SIZE * SCALE,
        }
        const mapDTO: MapDTO<string> = {
            user_id: user._id,
            //TODO: user must select entry point
            name: _name,
            primary: primary,
            entrance: _entrance,
            //TODO: user can select portals to other maps
            // of their own or other players
            portals: [],
            data: JSON.stringify(images),
        };

        await postMap({ token, map: mapDTO }).then((res) => {
            if (res.error) {
                const { data } = res.error as { data: { error: string } };
                if (data && data.error) {
                    switch (data.error) {
                        case MapError.MapExists:
                            setConfirmModal(
                                `Overwrite existing map: ${name}?`,
                                (confirm) => {
                                    if (confirm) {
                                        updateMap({ token, map: mapDTO }).then(
                                            (res) => {
                                                if (res.error) {
                                                    setMessageModal(
                                                        "Error saving map"
                                                    );
                                                } else {
                                                    setMessageModal(
                                                        "Map saved successfully",
                                                        () => getMaps()
                                                    );
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                            break;
                        case MapError.ErrorUpdatingMap:
                            setMessageModal("Error saving map");
                    }
                }
            } else {
                setMessageModal("Map saved successfully", () => getMaps());
            }
        });
    }

    const initialValue: MapData = {
        getMaps,
        allMaps,
        loadMap,
        saveMap,
        name,
        setName,
        primary,
        setPrimary,
        entrance,
        setEntrance,
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
        changeImageType,
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
