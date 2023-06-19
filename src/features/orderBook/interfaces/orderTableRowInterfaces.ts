export interface OrderTableRowInterface{
  count:number,
  amount:number,
  price:number|string,
  total?:number,
  isReversible?:boolean,
  progressBarWidth?:number,
}

export interface StyleObj{
  width:string,
  backgroundColor:string,
  right?:number
  left?:number
}