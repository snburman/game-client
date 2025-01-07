import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { type BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";

// Stack
export type RootStackParamList = {
    login: undefined;
    tabs: undefined;
}

export type LoginProps = NativeStackScreenProps<RootStackParamList, "login">;
export type TabsProps = NativeStackScreenProps<RootStackParamList, "tabs">;
export type HomeStackProps = NativeStackScreenProps<RootStackParamList>;

// Tabs
export type HomeTabsParamList = {
    index: undefined;
    create: undefined;
    game: undefined;
    settings: undefined;
    images: undefined;
    map: undefined;
};

export type HomeTabsProps = NavigatorScreenParams<HomeTabsParamList>;
export type IndexProps = BottomTabScreenProps<HomeTabsParamList, "index">;
export type CreateProps = BottomTabScreenProps<HomeTabsParamList, "create">;
export type GameProps = BottomTabScreenProps<HomeTabsParamList, "game">;
export type SettingsProps = BottomTabScreenProps<HomeTabsParamList, "settings">;


// Drawer
export type CreateDrawerParamList = {
    draw: undefined;
    images: undefined;
    map: undefined;
}

export type CreateDrawerProps = DrawerScreenProps<CreateDrawerParamList>;
export type DrawProps = DrawerScreenProps<CreateDrawerParamList, "draw">;
export type ImagesProps = DrawerScreenProps<CreateDrawerParamList, "images">;
export type MapProps = DrawerScreenProps<CreateDrawerParamList, "map">;