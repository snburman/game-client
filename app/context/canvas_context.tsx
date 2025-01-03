import { usePostImageMutation } from "@/redux/image.slice";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Image } from "@/redux/models/image.model";
import cloneDeep from "lodash/cloneDeep";
import { isEqual } from "lodash";

export const CANVAS_SIZE = 16;
export const CELL_SIZE = 20;
export const DEFAULT_COLOR = "#000000";
export const DEFAULT_NAME = "untitled";
const HISTORY_LIMIT = 20;

export type LayerMap = Map<string, string>;

export type CellData = {
    x: number;
    y: number;
    color: string;
    r?: number;
    g?: number;
    b?: number;
    a?: number;
};

type CanvasData = {
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
    // Name of the image
    name: string;
    setName: (name: string) => void;
    save: () => void;
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
    //////////////////////////////////////////
    // Config
    //////////////////////////////////////////
    const [cellSize, setCellSize] = useState(CELL_SIZE);
    const [name, setName] = useState(DEFAULT_NAME);

    //////////////////////////////////////////
    // Canvas State
    //////////////////////////////////////////
    // initialize with a single layer
    const layers = useRef<LayerMap[]>([
        generateLayer(CANVAS_SIZE, CANVAS_SIZE),
    ]);
    const [cells, setCells] = useState<Array<CellData[][]>>([
        generateCellsFromLayer(layers.current[0], CANVAS_SIZE, CANVAS_SIZE),
    ]);

    //////////////////////////////////////////
    // Tool button state
    //////////////////////////////////////////
    const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);
    const [previousColor, setPreviousColor] = useState(DEFAULT_COLOR);
    const [grid, setGrid] = useState(true);
    const [fill, setFill] = useState(false);

    //////////////////////////////////////////
    // Layer state
    //////////////////////////////////////////
    const [layerHistory, setLayerHistory] = useState<LayerMap[][]>(
        cloneDeep([layers.current])
    );
    const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
    const [historyIndex, setHistoryIndex] = useState(0);
    // state to track continuous drawing which should only trigger addLayerHistory once
    const [isPressed, setIsPressed] = useState(false);

    //////////////////////////////////////////
    // Layer management
    //////////////////////////////////////////
    function generateLayer(width: number, height: number): Map<string, string> {
        const layer = new Map();
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
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
        layers.current[index] = generateLayer(CANVAS_SIZE, CANVAS_SIZE);
        cells[index] = generateCellsFromLayer(
            layers.current[index],
            CANVAS_SIZE,
            CANVAS_SIZE
        );
        setLayerHistory(cloneDeep([layers.current]));
        setHistoryIndex(0);
        setCells([...cells]);
    }

    function generateCellsFromLayer(
        layer: LayerMap,
        width: number,
        height: number
    ): CellData[][] {
        const cells: CellData[][] = [];
        for (let x = 0; x < width; x++) {
            cells.push([]);
            for (let y = 0; y < height; y++) {
                const color = layer.get(`${x}-${y}`);
                cells[x].push({ x, y, color: color || "transparent" });
            }
        }
        return cells;
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
            CANVAS_SIZE,
            CANVAS_SIZE
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
            CANVAS_SIZE,
            CANVAS_SIZE
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
            if (x < 0 || y < 0 || x >= CANVAS_SIZE || y >= CANVAS_SIZE)
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
            if (x < CANVAS_SIZE - 1) queue.push({ x: x + 1, y });
            if (y > 0) queue.push({ x, y: y - 1 });
            if (y < CANVAS_SIZE - 1) queue.push({ x, y: y + 1 });
        }
        if (!isPressed) addLayerHistory();
        setIsPressed(true);
        layers.current[selectedLayerIndex] = layer;
        setCells([...cells]);
    }

    //////////////////////////////////////////
    // API calls
    //////////////////////////////////////////
    // TODO: use isLoading and isError to show loading and error states
    const [postImage, { isLoading, isSuccess, isError }] =
        usePostImageMutation();
    async function save() {
        let _cells = getCells(selectedLayerIndex);
        for (let x = 0; x < CANVAS_SIZE; x++) {
            for (let y = 0; y < CANVAS_SIZE; y++) {
                let cell = _cells[x][y];
                const { r, g, b, a } = hexToRgba(cell.color);
                _cells[x][y] = { ...cell, r, g, b, a };
            }
        }

        // TODO: user can reopen and edit image, coordinates should come from existing document or 0,0
        const image: Image = {
            x: 0,
            y: 0,
            name: name,
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            data: JSON.stringify(_cells),
        };

        await postImage(image);
        if (isSuccess) {
            alert("Image saved successfully");
        } else if (isError) {
            alert("Failed to save image");
        }
    }

    const initialValue: CanvasData = {
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
        name,
        setName,
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
