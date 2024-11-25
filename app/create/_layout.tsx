import CanvasProvider from "../context/canvas_context";
import Draw from ".";

export default function DrawLayout() {
    return (
        <CanvasProvider>
            <Draw />
        </CanvasProvider>
    );
}
