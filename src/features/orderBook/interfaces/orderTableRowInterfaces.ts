export interface OrderTableRowInterface{
  count:number,
  amount:number,
  total:number,
  price:number|string,
  isReversible:boolean,
  progressBarWidth:number
}

export interface StyleObj{
  width:string,
  backgroundColor:string,
  right?:number
  lefy?:number
}