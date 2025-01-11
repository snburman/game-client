import React from "react";

export type ImageType = "tile" | "object"
 
export type Image<T> = {
    _id?: string;
    user_id: string;
    name: string;
    type: ImageType;
    x: number;
    y: number;
    width: number;
    height: number;
    data: T;
    component?: React.JSX.Element;
}