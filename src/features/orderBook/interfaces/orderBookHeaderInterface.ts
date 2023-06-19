import { Pair } from "./orderBookInterface";

export interface OrderBookHeaderInterface{
  toggleFn:Function,
  isCollapsed:boolean,
  pairText?:Pair
}