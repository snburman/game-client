import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import EntypoIcons from "react-native-vector-icons/Entypo";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DEFAULT_CANVAS_SIZE, useCanvas } from "../context/canvas_context";
import { Image, CellData, ImageType } from "@/redux/models/image.model";
import { LayerPreview } from "@/components/canvas";
import { cloneDeep, set } from "lodash";
import { theme } from "@/app/_theme";
import { useModals } from "../context/modal_context";
import { ImagesScrollView } from "./images";
import { DrawerButton } from "@/components/draw_drawer_content";
import { MapProps } from "../types/navigation";
import { Button, RadioButton, TextInput } from "react-native-paper";
import { Radio, Typography } from "@mui/joy";
import { Slider } from "@react-native-assets/slider";
import PlainModal from "@/components/modal";
import { ScrollView } from "react-native-gesture-handler";
import { useDevice } from "../hooks/device";
import { useMaps } from "../context/map_context";
import { useDeleteMapMutation } from "@/redux/map.slice";
import { useAuth } from "../context/auth_context";

const MAP_DIMENSIONS = 6;
const SCALE = 3.5;

export default function Map({ navigation }: MapProps) {
    const { isMobile, width } = useDevice();
    const { isUsingCanvas } = useCanvas();
    const {
        imageMap,
        selectedImage,
        setSelectedImage,
        editCoords,
        setEditCoords,
        eraseMap,
        placeSelectedImage,
        removeImage,
        changeXPosition,
        changeYPosition,
        changeImageType,
    } = useMaps();
    const { setMessageModal, setConfirmModal } = useModals();
    const [imagesModalVisible, setImagesModalVisible] = useState(false);
    // indicates that pressing a tile will trigger editing of the contents
    const [editDetailsOn, setEditDetailsOn] = useState(false);

    // select image to be placed on map
    function handleSelectImage(image: Image<CellData[][]>) {
        setImagesModalVisible(false);
        let _image = cloneDeep(image);
        _image.asset_type = image.asset_type;
        setSelectedImage(_image);
    }

    // place selected image at given coordinates on map
    function handlePressTile(x: number, y: number) {
        setEditCoords({ x, y });
        if (editDetailsOn) return;
        // cannot place empty image
        if (!selectedImage) {
            setMessageModal("Select an image to put on the map", () =>
                setImagesModalVisible(true)
            );
            return;
        }
        // maximum two images per cell
        const coords = imageMap[y][x];
        if (
            coords.images.length === 2 &&
            selectedImage.asset_type != ImageType.Portal
        ) {
            setMessageModal("This area already has two (2) images");
            return;
        }
        if (selectedImage.asset_type == ImageType.Portal) {
            // only one portal per map
            const portal = coords.images.find(
                (i) => i.asset_type == ImageType.Portal
            );
            if (portal) {
                setMessageModal("This area already has a portal");
                return;
            }
            // portal cannot share space with an object
            const object = coords.images.find(
                (i) => i.asset_type == ImageType.Object
            );
            if (object) {
                setMessageModal("Portals cannot share space with objects");
                return;
            }
        }
        placeSelectedImage(x, y);
    }

    function handlePressEditDetailsButton() {
        setEditDetailsOn(!editDetailsOn);
    }

    function handleEraseMap() {
        setConfirmModal("Erase map?", (confirm) => {
            confirm && eraseMap();
        });
    }

    if (isUsingCanvas) return null;
    return (
        <>
            <DrawerButton onPress={() => navigation.openDrawer()} />
            <View
                style={[
                    styles.container,
                    { justifyContent: isMobile ? "flex-end" : "center" },
                ]}
            >
                <View>
                    <View style={[styles.mapCellContainer]}>
                        {imageMap?.map((row) =>
                            row.map((mc, i) => (
                                <Pressable
                                    onPress={() =>
                                        handlePressTile(mc.mapX, mc.mapY)
                                    }
                                    key={i}
                                >
                                    <View
                                        style={[
                                            styles.mapCell,
                                            {
                                                backgroundColor: (
                                                    mc.mapY % 2 == 0
                                                        ? mc.mapX % 2 == 0
                                                        : mc.mapX % 2 !== 0
                                                )
                                                    ? "#FFFFFF"
                                                    : "#ECECEC",
                                            },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.editCellHighlight,

                                                !(
                                                    editDetailsOn &&
                                                    mc.mapX == editCoords?.x &&
                                                    mc.mapY == editCoords.y
                                                ) && { display: "none" },
                                            ]}
                                            key={i}
                                        />
                                        {mc.images &&
                                            mc.images.map((image, i) => (
                                                <View key={i}>
                                                    <View
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: image.y - mc.y,
                                                            left:
                                                                image.x - mc.x,
                                                        }}
                                                    >
                                                        <LayerPreview
                                                            {...image}
                                                            cellSize={SCALE}
                                                        />
                                                    </View>
                                                </View>
                                            ))}
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
                {/* tool button bar */}
                <View style={styles.toolButtonContainer}>
                    {/* image selection button */}
                    <Pressable
                        style={[
                            styles.toolButton,
                            { backgroundColor: "#DDDDDD" },
                        ]}
                        onPress={() => {
                            setEditDetailsOn(false);
                            setEditCoords(undefined);
                            setImagesModalVisible(true);
                        }}
                    >
                        {selectedImage ? (
                            <LayerPreview {...selectedImage} cellSize={2.75} />
                        ) : (
                            <EntypoIcons name="images" size={30} />
                        )}
                    </Pressable>
                    {/* Edit details button */}
                    <Pressable
                        style={[
                            styles.toolButton,
                            {
                                backgroundColor: editDetailsOn
                                    ? "rgba(0,195,255, 0.5)"
                                    : "#FFFFFF",
                            },
                        ]}
                        onPress={handlePressEditDetailsButton}
                    >
                        <FontAwesomeIcons name="hand-pointer-o" size={30} />
                    </Pressable>
                    <Pressable
                        style={styles.toolButton}
                        onPress={handleEraseMap}
                    >
                        <MaterialCommunityIcons
                            name="delete"
                            size={30}
                            style={{ color: "#D2042D" }}
                        />
                    </Pressable>
                    <SaveMapButton />
                </View>
                {/* MODALS */}
                {/* image selection modal*/}
                <PlainModal
                    visible={imagesModalVisible}
                    setVisible={setImagesModalVisible}
                    style={{ padding: 0 }}
                >
                    <View style={styles.imagesModalContent}>
                        <ImagesScrollView
                            onPress={handleSelectImage}
                            navigateToCanvas={() => {
                                navigation.navigate("draw");
                                setImagesModalVisible(false);
                            }}
                        />
                    </View>
                    <Button
                        mode="outlined"
                        uppercase={false}
                        style={{
                            marginTop: 10,
                            backgroundColor: "#FFFFFF",
                            width: 115,
                        }}
                        onPress={() => setImagesModalVisible(false)}
                    >
                        <Typography>Close</Typography>
                    </Button>
                </PlainModal>
                {/* editor panel*/}
                <View
                    style={[
                        styles.editorPanel,
                        width > 520 && {
                            height: 200,
                        },
                        width > 1350 && {
                            ...styles.panelRight,
                            height: "100%",
                        },
                    ]}
                >
                    <ScrollView
                        contentContainerStyle={styles.editorPanelContent}
                    >
                        {editCoords &&
                            imageMap[editCoords.y][editCoords.x].images.map(
                                (image, i) => (
                                    <View
                                        key={i}
                                        style={styles.editDetailsItem}
                                    >
                                        <View style={styles.editDetailsIcon}>
                                            <LayerPreview
                                                {...image}
                                                cellSize={SCALE}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                justifyContent: "center",
                                            }}
                                        >
                                            <View style={styles.rowContainer}>
                                                <Radio
                                                    checked={
                                                        image.asset_type ==
                                                        ImageType.Tile
                                                    }
                                                    onChange={() =>
                                                        changeImageType(
                                                            editCoords.x,
                                                            editCoords.y,
                                                            i,
                                                            ImageType.Tile
                                                        )
                                                    }
                                                />
                                                <Typography>Tile</Typography>
                                            </View>
                                            <View style={styles.rowContainer}>
                                                <Radio
                                                    checked={
                                                        image.asset_type ==
                                                        ImageType.Object
                                                    }
                                                    onChange={() =>
                                                        changeImageType(
                                                            editCoords.x,
                                                            editCoords.y,
                                                            i,
                                                            ImageType.Object
                                                        )
                                                    }
                                                />
                                                <Typography>Object</Typography>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <View
                                                style={[
                                                    styles.rowContainer,
                                                    {
                                                        opacity:
                                                            image.width ==
                                                            DEFAULT_CANVAS_SIZE
                                                                ? 0.3
                                                                : 1,
                                                    },
                                                ]}
                                            >
                                                <Slider
                                                    value={image.x}
                                                    step={1}
                                                    minimumValue={
                                                        editCoords.x *
                                                        (DEFAULT_CANVAS_SIZE *
                                                            SCALE)
                                                    }
                                                    maximumValue={
                                                        editCoords.x *
                                                            (DEFAULT_CANVAS_SIZE *
                                                                SCALE) +
                                                        DEFAULT_CANVAS_SIZE *
                                                            SCALE -
                                                        image.width * SCALE
                                                    }
                                                    style={styles.slider}
                                                    onValueChange={(value) =>
                                                        changeXPosition(
                                                            editCoords.x,
                                                            editCoords.y,
                                                            i,
                                                            value
                                                        )
                                                    }
                                                    thumbTintColor={"#019B0B"}
                                                />
                                                <Typography>X</Typography>
                                            </View>
                                            <View
                                                style={[
                                                    styles.rowContainer,
                                                    {
                                                        opacity:
                                                            image.width ==
                                                            DEFAULT_CANVAS_SIZE
                                                                ? 0.3
                                                                : 1,
                                                    },
                                                ]}
                                            >
                                                <Slider
                                                    value={image.y}
                                                    step={1}
                                                    minimumValue={
                                                        editCoords.y *
                                                        (DEFAULT_CANVAS_SIZE *
                                                            SCALE)
                                                    }
                                                    maximumValue={
                                                        editCoords.y *
                                                            (DEFAULT_CANVAS_SIZE *
                                                                SCALE) +
                                                        DEFAULT_CANVAS_SIZE *
                                                            SCALE -
                                                        image.height * SCALE
                                                    }
                                                    style={styles.slider}
                                                    onValueChange={(value) =>
                                                        changeYPosition(
                                                            editCoords.x,
                                                            editCoords.y,
                                                            i,
                                                            value
                                                        )
                                                    }
                                                    thumbTintColor={"#019B0B"}
                                                />
                                                <Typography>Y</Typography>
                                            </View>
                                        </View>
                                        <Pressable
                                            style={{
                                                justifyContent: "center",
                                                alignItems: "center",
                                                paddingLeft: 10,
                                            }}
                                            onPress={() =>
                                                removeImage(
                                                    editCoords.x,
                                                    editCoords.y,
                                                    i
                                                )
                                            }
                                        >
                                            <MaterialCommunityIcons
                                                name="delete"
                                                style={{
                                                    color: "#D2042D",
                                                    fontSize: 30,
                                                }}
                                            />
                                        </Pressable>
                                    </View>
                                )
                            )}
                    </ScrollView>
                </View>
            </View>
            <View style={styles.topToolBar}>
                <NewMapButton />
                <LoadMapButton />
            </View>
        </>
    );
}

const SaveMapButton = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { saveMap, name, setName, primary, setPrimary } = useMaps();

    function handleSave() {
        saveMap();
        setModalVisible(false);
    }

    return (
        <>
            <PlainModal
                visible={modalVisible}
                setVisible={setModalVisible}
                style={{ gap: 10 }}
            >
                <TextInput
                    mode="outlined"
                    label="Map name"
                    onChangeText={setName}
                    value={name}
                    placeholder="untitled"
                    style={{ backgroundColor: "white" }}
                />
                <Pressable
                    onPress={() => setPrimary(!primary)}
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <Typography>Home map</Typography>
                    <Radio checked={primary} />
                </Pressable>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                    <Button
                        mode="outlined"
                        uppercase={false}
                        onPress={handleSave}
                        style={{ width: 95 }}
                    >
                        <Typography>Save</Typography>
                    </Button>
                    <Button
                        mode="outlined"
                        uppercase={false}
                        onPress={() => setModalVisible(false)}
                        style={{ width: 95 }}
                    >
                        <Typography>Cancel</Typography>
                    </Button>
                </View>
            </PlainModal>
            <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.toolButton}
            >
                <MaterialCommunityIcons
                    name="content-save"
                    size={30}
                    style={[{ color: "#138007" }]}
                />
            </Pressable>
        </>
    );
};

const NewMapButton = () => {
    const { eraseMap, setName, setPrimary } = useMaps();
    const { setConfirmModal } = useModals();

    function handlePress() {
        setConfirmModal("Create new map?", (confirm) => {
            if (confirm) {
                eraseMap();
                setName("");
                setPrimary(false);
            }
        });
    }

    return (
        <Pressable onPress={handlePress} style={styles.toolButton}>
            <MaterialCommunityIcons
                name="file-plus-outline"
                size={30}
                style={{ color: "rgba(0, 0, 0, 0.7)" }}
            />
        </Pressable>
    );
};

const LoadMapButton = () => {
    const { token } = useAuth();
    const { getMaps, loadMap, allMaps, name, setName, eraseMap, setPrimary } =
        useMaps();
    const { setPlainModal, setMessageModal, setConfirmModal } = useModals();
    const [deleteMap] = useDeleteMapMutation();

    function handleDeleteMap(id: string) {
        if (!token) return;
        setConfirmModal("Delete map?", (confirm) => {
            if (confirm) {
                deleteMap({ token, id }).then((res) => {
                    if (res.error) {
                        setMessageModal("Error deleting map");
                    } else {
                        setMessageModal("Map deleted successfully", () => {
                            const deletedMap = allMaps?.find(
                                (map) => map._id === id
                            );
                            if (deletedMap?.name === name) {
                                eraseMap();
                                setName("");
                                setPrimary(false);
                            }
                            getMaps();
                        });
                    }
                });
            }
            setPlainModal(undefined);
        });
    }

    function handlePress() {
        if (!allMaps) {
            setMessageModal("No saved maps");
            return;
        }
        setPlainModal(
            <>
                <ScrollView style={{ width: 250, maxHeight: 300 }}>
                    {allMaps?.map((map, i) => (
                        <View
                            key={i}
                            style={{
                                alignItems: "center",
                                flexDirection: "row",
                                paddingRight: 5,
                                marginBottom: 15,
                            }}
                        >
                            <Typography style={{ flex: 1 }}>
                                {map.name}
                            </Typography>
                            <Pressable
                                onPress={() => {
                                    if (!map._id) return;
                                    loadMap(map._id);
                                    setName(map.name);
                                    setPlainModal(undefined);
                                }}
                                style={styles.savedEditButton}
                            >
                                <MaterialCommunityIcons
                                    name="folder-open-outline"
                                    size={20}
                                    style={{ color: "rgba(0, 0, 0, 0.7)" }}
                                />
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    if (!map._id) return;
                                    handleDeleteMap(map._id);
                                }}
                                style={[
                                    styles.savedEditButton,
                                    { marginLeft: 10 },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name="delete"
                                    size={20}
                                    style={{ color: "#D2042D" }}
                                />
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
                <Button
                    mode="outlined"
                    uppercase={false}
                    onPress={() => setPlainModal(undefined)}
                    style={{ marginTop: 10 }}
                >
                    <Typography>Close</Typography>
                </Button>
            </>
        );
    }

    return (
        <Pressable onPress={handlePress} style={styles.toolButton}>
            <MaterialCommunityIcons
                name="folder-open-outline"
                size={30}
                style={{ color: "rgba(0, 0, 0, 0.7)" }}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    mapCellContainer: {
        ...theme.shadow.small,
        flexDirection: "row",
        flexWrap: "wrap",
        borderColor: "#757575",
        height: DEFAULT_CANVAS_SIZE * SCALE * MAP_DIMENSIONS,
        width: DEFAULT_CANVAS_SIZE * SCALE * MAP_DIMENSIONS,
    },
    editCellHighlight: {
        zIndex: 100,
        position: "absolute",
        top: 0,
        left: 0,
        width: DEFAULT_CANVAS_SIZE * SCALE,
        height: DEFAULT_CANVAS_SIZE * SCALE,
        backgroundColor: "rgba(0,195,255, 0.5)",
    },
    mapCell: {
        width: DEFAULT_CANVAS_SIZE * SCALE,
        height: DEFAULT_CANVAS_SIZE * SCALE,
    },
    toolButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        width: "100%",
        paddingTop: 10,
    },
    toolButton: {
        ...theme.shadow.small,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
    },
    imagesModalContent: {
        height: 500,
        maxHeight: "80%",
        width: 600,
        maxWidth: "90%",
    },
    editorPanel: {
        width: 375,
        height: 140,
    },
    editorPanelContent: {
        height: "100%",
        justifyContent: "center",
        paddingTop: 2,
        paddingBottom: 2,
    },
    editDetailsItem: {
        flexDirection: "row",
        padding: 5,
        gap: 10,
    },
    editDetailsIcon: {
        ...theme.shadow.small,
        justifyContent: "center",
        alignItems: "center",
        width: DEFAULT_CANVAS_SIZE * SCALE,
        height: DEFAULT_CANVAS_SIZE * SCALE,
        backgroundColor: "#DDDDDD",
    },
    panelRight: {
        position: "absolute",
        justifyContent: "center",
        top: 0,
        right: 0,
        width: 365,
        paddingBottom: 50,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        gap: 5,
    },
    slider: {
        marginLeft: 10,
        paddingLeft: 10,
        width: 100,
        padding: 10,
    },
    topToolBar: {
        position: "absolute",
        top: 7,
        right: 7,
        flexDirection: "row",
        gap: 10,
    },
    savedEditButton: {
        ...theme.shadow.small,
        padding: 5,
    },
});
