import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { type BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
    login: undefined;
    tabs: undefined;
}

export type LoginProps = NativeStackScreenProps<RootStackParamList, "login">;
export type TabsProps = NativeStackScreenProps<RootStackParamList, "tabs">;
export type HomeStackProps = NativeStackScreenProps<RootStackParamList>;

export type HomeTabsParamList = {
    index: undefined;
    create: undefined;
    game: undefined;
    settings: undefined;
    images: undefined;
};

export type IndexProps = BottomTabScreenProps<HomeTabsParamList, "index">;
export type CreateProps = BottomTabScreenProps<HomeTabsParamList, "create">;
export type GameProps = BottomTabScreenProps<HomeTabsParamList, "game">;
export type SettingsProps = BottomTabScreenProps<HomeTabsParamList, "settings">;
export type ImagesProps = BottomTabScreenProps<HomeTabsParamList, "images">;

export type HomeTabsProps = NavigatorScreenParams<HomeTabsParamList>