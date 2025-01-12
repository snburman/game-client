import {
    ImageError,
    usePostImageMutation,
    useUpdateImageMutation,
} from "@/redux/image.slice";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { CellData, Image, ImageType } from "@/redux/models/image.model";
import cloneDeep from "lodash/cloneDeep";
import { isEqual } from "lodash";
import { useAuth } from "./auth_context";
import { useModals } from "./modal_context";
import { useLazyGetUserQuery } from "@/redux/auth.slice";

// TODO: Update width and height, not fixed square size
export const DEFAULT_CANVAS_SIZE = 16;
export const CELL_SIZE = 20;
export const DEFAULT_COLOR = "#000000";
export const DEFAULT_NAME = "untitled";
const HISTORY_LIMIT = 20;

export type LayerMap = Map<string, string>;

type CanvasData = {
    newCanvas(width: number, height: number): void;
    // Name of the image
    name: string;
    setName: (name: string) => void;
    type: ImageType;
    setType: (t: ImageType) => void;
    setEditImage(image: Image<CellData[][]>): void;
    isUsingCanvas: boolean;
    setIsUsingCanvas: (isUsing: boolean) => void;
    canvasSize: { width: number; height: number };
    // Cells and layers share an array index
    // Cells are for rendering by the canvas
    cells: Array<CellData[][]>;
    getCells: (index: number) => CellData[][];
    cellSize: number;
    setCellSize: (size: number) => void;
    // Grid controls grid markers on the canvas
    grid: boolean;
    setGrid: (grid: boolean) => void;
    layers: LayerMap[];
    selectedLayerIndex: number;
    setSelectedLayerIndex: (index: number) => void;
    clearLayer: (index: number) => void;
    currentColor: string;
    setCurrentColor: (color: string) => void;
    previousColor: string;
    setPreviousColor: (color: string) => void;
    update: (x: number, y: number) => void;
    save: (type: ImageType) => void;
    fill: boolean;
    setFill: (fill: boolean) => void;
    fillColor: (x: number, y: number) => void;
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
    isPressed: boolean;
    setIsPressed: (pressed: boolean) => void;
};

const CanvasContext = createContext<CanvasData | undefined>(undefined);

export default function CanvasProvider({ children }: React.PropsWithChildren) {
    const { user, token } = useAuth();
    const { setMessageModal, setConfirmModal } = useModals();

    // used to communicate with other components if user is using canvas
    // used to remove excess state to free memory before using canvas
    const [isUsingCanvas, setIsUsingCanvas] = useState(true);

    //////////////////////////////////////////
    // Config
    //////////////////////////////////////////
    const [canvasSize, setCanvasSize] = useState({
        width: DEFAULT_CANVAS_SIZE,
        height: DEFAULT_CANVAS_SIZE,
    });
    const [cellSize, setCellSize] = useState(CELL_SIZE);
    const [name, setName] = useState(DEFAULT_NAME);
    const [type, setType] = useState<ImageType>("tile");

    //////////////////////////////////////////
    // Canvas State
    //////////////////////////////////////////
    // initialize with a single layer
    const layers = useRef<LayerMap[]>([generateLayer(canvasSize)]);
    const [cells, setCells] = useState<Array<CellData[][]>>([
        generateCellsFromLayer(layers.current[0], canvasSize),
    ]);
    const [layerHistory, setLayerHistory] = useState<LayerMap[][]>(
        cloneDeep([layers.current])
    );
    const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
    const [historyIndex, setHistoryIndex] = useState(0);
    // state to track continuous drawing which should only trigger addLayerHistory once
    const [isPressed, setIsPressed] = useState(false);

    //////////////////////////////////////////
    // Tool button state
    //////////////////////////////////////////
    const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);
    const [previousColor, setPreviousColor] = useState(DEFAULT_COLOR);
    const [grid, setGrid] = useState(true);
    const [fill, setFill] = useState(false);

    //////////////////////////////////////////
    // Layer management
    //////////////////////////////////////////
    function generateLayer(d: {
        width: number;
        height: number;
    }): Map<string, string> {
        const layer = new Map();
        for (let x = 0; x < d.width; x++) {
            for (let y = 0; y < d.height; y++) {
                layer.set(`${x}-${y}`, "transparent");
            }
        }
        return layer;
    }

    function clearLayer(index: number) {
        const layer = layers.current[index];
        if (!layer) {
            throw new Error(`Layer ${index} not found`);
        }
        layers.current[index] = generateLayer(canvasSize);
        cells[index] = generateCellsFromLayer(
            layers.current[index],
            canvasSize
        );
        setLayerHistory(cloneDeep([layers.current]));
        setHistoryIndex(0);
        setCells([...cells]);
    }

    function generateCellsFromLayer(
        layer: LayerMap,
        d: { width: number; height: number }
    ): CellData[][] {
        const cells: CellData[][] = [];
        for (let x = 0; x < d.height; x++) {
            cells.push([]);
            for (let y = 0; y < d.width; y++) {
                const color = layer.get(`${x}-${y}`);
                cells[x].push({ x, y, color: color || "transparent" });
            }
        }
        return cells;
    }

    function setEditImage(image: Image<CellData[][]>) {
        setCanvasSize({ ...image });
        const layer: LayerMap = generateLayer({ ...image });
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                layer.set(`${x}-${y}`, image.data[x][y].color);
            }
        }
        layers.current = [layer];
        setLayerHistory([layers.current]);
        setHistoryIndex(0);
        const _cells = generateCellsFromLayer(layers.current[0], { ...image });
        setCells([_cells]);
        setName(image.name);
    }

    function newCanvas(width: number, height: number) {
        setCanvasSize({ width, height });
        const layer: LayerMap = generateLayer({ width, height });
        layers.current = [layer];
        setLayerHistory([layers.current]);
        setHistoryIndex(0);
        const _cells = generateCellsFromLayer(layers.current[0], {
            width,
            height,
        });
        setCells([_cells]);
        setName(DEFAULT_NAME);
    }

    //////////////////////////////////////////
    // Layer history
    //////////////////////////////////////////

    function addLayerHistory() {
        const _historyIndex =
            historyIndex === HISTORY_LIMIT ? historyIndex : historyIndex + 1;
        const history = cloneDeep(layerHistory.splice(0, _historyIndex));
        // Avoid duplicate histories
        if (
            isEqual(
                history[history.length - 1],
                layerHistory[layerHistory.length - 1]
            )
        ) {
            return;
        }
        if (history.length === HISTORY_LIMIT) {
            history.shift();
        }
        history.push(layers.current);
        setLayerHistory(history);
        setHistoryIndex(_historyIndex);
    }

    const canUndo = useMemo(() => !(historyIndex === 0), [historyIndex]);
    const canRedo = useMemo(
        () => !(historyIndex === layerHistory.length - 1),
        [historyIndex, layerHistory.length]
    );

    function undo() {
        if (!canUndo) return;
        layers.current = layerHistory[historyIndex - 1];
        const _cells = generateCellsFromLayer(
            layers.current[selectedLayerIndex],
            canvasSize
        );
        setHistoryIndex(historyIndex - 1);
        setCells([_cells]);
    }

    function redo() {
        if (!canRedo) return;
        setHistoryIndex(historyIndex + 1);
        layers.current = layerHistory[historyIndex + 1];
        const _cells = generateCellsFromLayer(
            layers.current[selectedLayerIndex],
            canvasSize
        );
        setCells([_cells]);
    }

    //////////////////////////////////////////
    // Cell manipulation
    //////////////////////////////////////////
    function getCells(index: number): CellData[][] {
        return cells[index];
    }

    function update(x: number, y: number) {
        if (!isUsingCanvas) setIsUsingCanvas(true);
        const layer = cloneDeep(layers.current[selectedLayerIndex]);
        if (!layer) {
            throw new Error(`Layer ${selectedLayerIndex} not found`);
        }
        // gesture handler should not fire multiple times for the same cell
        const cell_color = layer.get(`${x}-${y}`);
        if (cell_color === currentColor) return;

        // history should only be added once for continuous drawing
        if (!isPressed) addLayerHistory();
        setIsPressed(true);

        // update layer
        layer.set(`${x}-${y}`, currentColor);
        layers.current[selectedLayerIndex] = layer;

        // update cells
        cells[selectedLayerIndex][x][y].color = currentColor;
        setCells([...cells]);
    }

    // bucket tool implementation using flood fill algorithm
    function fillColor(x: number, y: number) {
        const layer = cloneDeep(layers.current[selectedLayerIndex]);
        if (!layer) {
            throw new Error(`Layer ${selectedLayerIndex} not found`);
        }

        const target_color = layer.get(`${x}-${y}`);
        if (target_color === currentColor) return;

        // get adjacent cells
        const queue = [{ x, y }];
        while (queue.length > 0) {
            let { x, y } = queue.shift()!;
            // if not inside canvas, continue
            if (
                x < 0 ||
                y < 0 ||
                x >= canvasSize.width ||
                y >= canvasSize.height
            )
                continue;
            // if not target color, continue
            const cell_color = layer.get(`${x}-${y}`);
            if (cell_color !== target_color) continue;
            // if already painted with current color, continue
            if (cell_color === currentColor) continue;

            // update cell
            layer.set(`${x}-${y}`, currentColor);
            cells[selectedLayerIndex][x][y].color = currentColor;

            // add adjacent cells
            // west, east, north, south
            if (x > 0) queue.push({ x: x - 1, y });
            if (x < canvasSize.width - 1) queue.push({ x: x + 1, y });
            if (y > 0) queue.push({ x, y: y - 1 });
            if (y < canvasSize.height - 1) queue.push({ x, y: y + 1 });
        }
        if (!isPressed) addLayerHistory();
        setIsPressed(true);
        layers.current[selectedLayerIndex] = layer;
        setCells([...cells]);
    }

    //////////////////////////////////////////
    // API calls
    //////////////////////////////////////////
    const [postImage] = usePostImageMutation();
    const [updateImage] = useUpdateImageMutation();
    const [getUserImages] = useLazyGetUserQuery();

    async function save(type: ImageType) {
        if (!token) return;
        let _cells = getCells(selectedLayerIndex);
        for (let x = 0; x < canvasSize.height; x++) {
            for (let y = 0; y < canvasSize.width; y++) {
                let cell = _cells[x][y];
                const { r, g, b, a } = hexToRgba(cell.color);
                _cells[x][y] = { ...cell, r, g, b, a };
            }
        }
        if (!user?._id) {
            throw new Error("Missing user id");
        }

        const image: Image<string> = {
            user_id: user._id,
            name: name,
            type: type,
            x: 0,
            y: 0,
            ...canvasSize,
            data: JSON.stringify(_cells),
        };

        await postImage({ token, image }).then((res) => {
            if (res.error) {
                const { data } = res.error as { data: { error: string } };
                if (data && data.error == ImageError.ImageExists) {
                    setConfirmModal(
                        `Overwrite existing image: ${name}?`,
                        (confirm) => {
                            if (confirm) {
                                // update image
                                updateImage({ token, image }).then((res) => {
                                    if (res.error) {
                                        setMessageModal(
                                            "Failed to update image"
                                        );
                                    } else {
                                        getUserImages(token);
                                        setMessageModal(
                                            "Image saved successfully"
                                        );
                                    }
                                });
                            }
                        }
                    );
                } else {
                    setMessageModal("Failed to save image");
                }
            } else {
                getUserImages(token);
                setMessageModal("Image saved successfully");
            }
        });
    }

    const initialValue: CanvasData = {
        newCanvas,
        name,
        setName,
        type,
        setType,
        canvasSize,
        isUsingCanvas,
        setIsUsingCanvas,
        setEditImage,
        cells,
        getCells,
        cellSize,
        setCellSize,
        grid,
        setGrid,
        layers: layers.current,
        selectedLayerIndex,
        setSelectedLayerIndex,
        clearLayer,
        currentColor,
        setCurrentColor,
        previousColor,
        setPreviousColor,
        update,
        save,
        fill,
        setFill,
        fillColor,
        canUndo,
        canRedo,
        undo,
        redo,
        isPressed,
        setIsPressed,
    };

    return (
        <CanvasContext.Provider value={initialValue}>
            {children}
        </CanvasContext.Provider>
    );
}

export function useCanvas() {
    const context = useContext(CanvasContext);
    if (context === undefined) {
        throw new Error("useCanvas must be used within a CanvasProvider");
    }
    return context;
}

function hexToRgba(hex: string) {
    const bigint = parseInt(hex.slice(1), 16);
    if (hex === "transparent") {
        return { r: 0, g: 0, b: 0, a: 0 };
    }
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
        a: 255,
    };
}
