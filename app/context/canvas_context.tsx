import { createContext, useContext, useRef, useState } from "react";

export const CANVAS_SIZE = 16;

export type LayerMap = Map<string, string>;

export type CellData = {
    x: number;
    y: number;
    color: string;
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
    update: (x: number, y: number) => void;
}

const CanvasContext = createContext<CanvasData | undefined>(undefined);

export default function CanvasProvider({children}: React.PropsWithChildren) {
    const [currentColor, setCurrentColor] = useState("#000000");
    // initialize with a single layer
    const layers = useRef<LayerMap[]>([generateLayer(CANVAS_SIZE, CANVAS_SIZE)]);
    const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
    const [cells, setCells] = useState<Array<CellData[][]>>([generateCellsFromLayer(layers.current[0], CANVAS_SIZE, CANVAS_SIZE)]);
    const [cellSize, setCellSize] = useState(20);
    const [grid, setGrid] = useState(true);

    function generateLayer(width: number, height: number): Map<string, string> {
        const layer = new Map();
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                layer.set(`${x}-${y}`, "transparent");
            }
        }
        return layer;
    }

    function generateCellsFromLayer(layer: LayerMap, width: number, height: number): CellData[][] {
        const cells: CellData[][] = [];
        for (let x = 0; x < width; x++) {
            cells.push([]);
            for (let y = 0; y < height; y++) {
                const color = layer.get(`${x}-${y}`)
                cells[x].push({ x, y, color:  color  || "transparent" });
            }
        }
        return cells;
    }

    function clearLayer(index: number) {
        const layer = layers.current[index];
        if (!layer) {
            throw new Error(`Layer ${index} not found`);
        }
        layers.current[index] = generateLayer(CANVAS_SIZE, CANVAS_SIZE);
        cells[index] = generateCellsFromLayer(layers.current[index], CANVAS_SIZE, CANVAS_SIZE);
        setCells([...cells]);
    }

    function getCells(index: number): CellData[][] {
        return cells[index];
    }

    function update(x: number, y: number) {
        const layer = layers.current[selectedLayerIndex];
        if (!layer) {
            throw new Error(`Layer ${selectedLayerIndex} not found`);
        }
        // Gesture handler will fire multiple times for the same cell
        const cell_color = layer.get(`${x}-${y}`);
        if (cell_color === currentColor) return;

        // Update layer
        layer.set(`${x}-${y}`, currentColor);
        layers.current[selectedLayerIndex] = layer

        // Update cells
        cells[selectedLayerIndex][x][y].color = currentColor;
        setCells([...cells]);
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
        update: update,
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
