import { OrderTableRowInterface } from "./orderTableRowInterfaces";

export type SocketResponse = [number, [number, number, number] | string]

export interface ResponseTransformObject {
    [key: string | number]: OrderTableRowInterface
}