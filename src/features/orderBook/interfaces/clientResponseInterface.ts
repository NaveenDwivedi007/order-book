import { OrderTableRowInterface } from "./orderTableRowInterfaces";

export type SocketResponse = [number, [number, number, number] | string]
export interface SocketResponseInterface {
    chanId:number
    channel:string
    event:string
    freq:string
    len:string
    pair:string
    prec:string
    symbol:string
}

export interface ResponseTransformObject {
    [key: string | number]: OrderTableRowInterface
}