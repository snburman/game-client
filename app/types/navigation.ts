import { type BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";

export type HomeTabsParamList = {
    index: undefined;
    create: undefined;
    game: undefined;
};

export type IndexProps = BottomTabScreenProps<HomeTabsParamList, "index">;
export type CreateProps = BottomTabScreenProps<HomeTabsParamList, "create">;
export type GameProps = BottomTabScreenProps<HomeTabsParamList, "game">;

export type HomeTabsProps = NavigatorScreenParams<HomeTabsParamList>
