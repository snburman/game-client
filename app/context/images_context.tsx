import { CellData, Image, ImageType } from "@/redux/models/image.model";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useAuth } from "./auth_context";
import {
    ImageError,
    useDeleteImageMutation,
    useLazyGetUserImagesQuery,
    usePostImageMutation,
    useUpdateImageMutation,
} from "@/redux/image.slice";
import { useModals } from "./modal_context";
import { useCanvas } from "./canvas_context";

type ImagesData = {
    images: Image<CellData[][]>[];
    getImages(): Promise<void>;
    imagesLoading: boolean;
    saveImage: (name: string, type: ImageType) => Promise<void>;
    deleteImage(id: string): void;
};

const ImagesContext = createContext<ImagesData | undefined>(undefined);

export default function ImagesProvider({ children }: React.PropsWithChildren) {
    const { token, user } = useAuth();
    const { setConfirmModal, setAlert } = useModals();
    const [fetchImages, imageData] = useLazyGetUserImagesQuery();
    const [postImage] = usePostImageMutation();
    const [updateImage] = useUpdateImageMutation();
    const [_deleteImage] = useDeleteImageMutation();
    const { cells, canvasSize, selectedLayerIndex } = useCanvas();
    const [images, setImages] = useState<Image<CellData[][]>[]>([]);

    useEffect(() => {
        if (!token) return;
        getImages();
    }, [token, user]);

    async function getImages() {
        if (!token) return;
        fetchImages(token).then((res) => {
            if (res.error) {
                setAlert("danger", "Failed to fetch images");
            } else {
                if (res.data) {
                    setImages(res.data);
                }
            }
        });
    }

    const imagesLoading = useMemo(() => {
        return imageData.isFetching || imageData.isLoading;
    }, [imageData]);

    const saveImage = useCallback(
        async (name: string, iType: ImageType) => {
            if (!token) return;
            let _cells = cells[selectedLayerIndex];
            for (let x = 0; x < canvasSize.height; x++) {
                for (let y = 0; y < canvasSize.width; y++) {
                    let cell = _cells[x][y];
                    const { r, g, b, a } = hexToRgba(cell.color);
                    _cells[x][y] = { ...cell, r, g, b, a };
                }
            }
            if (!user?._id) {
                throw new Error("Missing user id");
            }

            let _image: Partial<Image<string>> = {
                user_id: user._id,
                x: 0,
                y: 0,
                ...canvasSize,
                data: JSON.stringify(_cells),
            };
            _image.asset_type = iType;
            _image.name = name;
            const image = _image as Image<string>;

            await postImage({ token, image }).then((res) => {
                if (res.error) {
                    const { data } = res.error as { data: { error: string } };
                    if (data && data.error == ImageError.ImageExists) {
                        setConfirmModal(
                            `Overwrite existing image: ${name}?`,
                            (confirm) => {
                                if (confirm) {
                                    updateImage({ token, image }).then(
                                        (res) => {
                                            if (res.error) {
                                                setAlert(
                                                    "danger",
                                                    "Failed to update image"
                                                );
                                            } else {
                                                getImages();
                                                setAlert(
                                                    "success",
                                                    "Image saved successfully"
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    } else {
                        setAlert("danger", "Failed to save image");
                    }
                } else {
                    getImages();
                    setAlert("success", "Image saved successfully");
                }
            });
        },
        [
            token,
            user,
            canvasSize,
            cells,
            selectedLayerIndex,
            cells[selectedLayerIndex],
            getImages,
        ]
    );

    function deleteImage(id: string) {
        if (!token) return;
        _deleteImage({ token, id }).then((res) => {
            if (!res.error) {
                setAlert("success", "Image deleted successfully");
                getImages();
            }
        });
    }

    const initialValue = {
        images,
        getImages,
        imagesLoading,
        saveImage,
        deleteImage,
    };

    return (
        <ImagesContext.Provider value={initialValue}>
            {children}
        </ImagesContext.Provider>
    );
}

export function useImages() {
    const context = useContext(ImagesContext);
    if (context === undefined) {
        throw new Error("useImages must be used within an ImagesProvider");
    }
    return context;
}

/////////////////////
// utility functions
/////////////////////

function hexToRgba(hex: string) {
    const bigint = parseInt(hex.slice(1), 16);
    if (hex === "transparent") {
        return { r: 0, g: 0, b: 0, a: 0 };
    }
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
        a: 255,
    };
}
