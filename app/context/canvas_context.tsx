import { createContext, useContext, useRef, useState } from "react";

export type LayerMap = Map<string, string>;
function generateLayer(width: number, height: number): Map<string, string> {
    const layer = new Map();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            layer.set(`${x}-${y}`, "transparent");
        }
    }
    return layer;
}

export type CellData = {
    x: number;
    y: number;
    color: string;
};
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

type CanvasData = {
    // Cells and layers share an array index
    // Cells are for rendering by the canvas
    cells: Array<CellData[][]>;
    // Layers are for storing the color data for the server
    getLayer: (index: number) => LayerMap;
    setLayer: (index: number, layer: LayerMap) => void;
    selectedLayer: number;
    setSelectedLayer: (index: number) => void;
    coords: { x: number; y: number };
    setCoords: (coords: { x: number; y: number }) => void;
    isPanning: boolean;
    setIsPanning: (isPanning: boolean) => void;
    isPointerDown: boolean;
    setIsPointerDown: (isPointerDown: boolean) => void;
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
        getLayer: getLayer,
        setLayer: setLayer,
        selectedLayer: selectedLayer,
        setSelectedLayer: setSelectedLayer,
        coords: coords,
        setCoords: setCoords,
        isPanning: isPanning,
        setIsPanning,
        isPointerDown: isPointerDown,
        setIsPointerDown,
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
