import { createContext, useContext, useRef, useState } from "react";

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
    cellSize: number;
    setCellSize: (size: number) => void;
    // Layers are for storing the color data for the server
    getLayer: (index: number) => LayerMap;
    setLayer: (index: number, layer: LayerMap) => void;
    selectedLayer: number;
    setSelectedLayer: (index: number) => void;
    currentColor: string;
    setCurrentColor: (color: string) => void;
}

const CanvasContext = createContext<CanvasData | undefined>(undefined);

export default function CanvasProvider({children}: React.PropsWithChildren) {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [currentColor, setCurrentColor] = useState("#000000");
    // initialize with a single layer
    const layers = useRef<LayerMap[]>([generateLayer(16, 16)]);
    // const [layers, setLayers] = useState<LayerMap[]>([generateLayer(16, 16)]);
    const [selectedLayer, setSelectedLayer] = useState(0);
    const [cells, setCells] = useState<Array<CellData[][]>>([generateCellsFromLayer(layers.current[0], 16, 16)]);
    const [cellSize, setCellSize] = useState(20);

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

    function setLayer(index: number, layer: LayerMap) {
        layers.current[index] = layer;
        const _cells = generateCellsFromLayer(layer, 16, 16);
        cells[index] = _cells;
        setCells([...cells]);
    }

    function getLayer(index: number) {
        return layers.current[index];
    }

    const initialValue: CanvasData = {
        cells: cells,
        cellSize: cellSize,
        setCellSize: setCellSize,
        getLayer: getLayer,
        setLayer: setLayer,
        selectedLayer: selectedLayer,
        setSelectedLayer: setSelectedLayer,
        currentColor: currentColor,
        setCurrentColor,
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
