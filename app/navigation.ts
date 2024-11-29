import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

type RootStackParamList = {
    index: undefined;
    create: undefined;
    game: undefined;
};

export type IndexProps = BottomTabScreenProps<RootStackParamList, "index">;
export type CreateProps = BottomTabScreenProps<RootStackParamList, "create">;
export type GameProps = BottomTabScreenProps<RootStackParamList, "game">;
