import React from "react";
import { CreateDrawerParamList, CreateProps } from "../types/navigation";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Draw from "./draw";
import Images from "./images";
import Map from "./map";
import DrawDrawerContent from "@/components/draw_drawer_content";
import { useDevice } from "../hooks/device";

export default function Create({ navigation }: CreateProps) {
    const Drawer = createDrawerNavigator<CreateDrawerParamList>();
    const {isMobile} = useDevice();

    return (
        <Drawer.Navigator
            initialRouteName="draw"
            screenOptions={{
                headerShown: false,
                drawerType: isMobile? "slide" : "permanent",
                drawerStyle: {
                    width: 250
                }
            }}
            drawerContent={DrawDrawerContent}
        >
            <Drawer.Screen name="draw" component={Draw} />
            <Drawer.Screen name="images" component={Images} />
            <Drawer.Screen name="map" component={Map} />
        </Drawer.Navigator>
    );
}
