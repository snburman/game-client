export type Image<T> = {
    _id?: string;
    user_id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    data: T;
}