import { type BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";

export type HomeTabsParamList = {
    login: undefined;
    index: undefined;
    create: undefined;
    game: undefined;
};

export type LoginProps = BottomTabScreenProps<HomeTabsParamList, "login">;
export type IndexProps = BottomTabScreenProps<HomeTabsParamList, "index">;
export type CreateProps = BottomTabScreenProps<HomeTabsParamList, "create">;
export type GameProps = BottomTabScreenProps<HomeTabsParamList, "game">;

export type HomeTabsProps = NavigatorScreenParams<HomeTabsParamList>
