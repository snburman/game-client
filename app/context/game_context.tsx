import { createContext, useContext, useState } from "react";

type GameData = {
    // isPlaying triggers reloading of the game iframe
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
}

const GameContext = createContext<GameData | undefined>(undefined);

export default function GameProvider({ children }: React.PropsWithChildren) {
    const [isPlaying, setIsPlaying] = useState(false);
    
    const initialValue = {
        isPlaying,
        setIsPlaying
    };

    return (
        <GameContext.Provider value={initialValue}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
