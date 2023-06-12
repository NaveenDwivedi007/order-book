export interface OrderHeaderInterdace{
  layout:'forward'|'reverse',
  headerText:headerText[]
}

type headerText = 'count'| 'amount' | 'total' | 'Price'