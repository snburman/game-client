import { createContext, useContext } from "react";

type GameData = {

}

const GameContext = createContext<GameData | undefined>(undefined);

export default function GameProvider({ children }: React.PropsWithChildren) {

    

    return (
        <GameContext.Provider value={undefined}>
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
