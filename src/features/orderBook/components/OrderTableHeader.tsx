import { OrderHeaderInterdace } from "../interfaces/orderHeaderInterfaces"
import '../orderBook.css'

function OrderTableHeader({
  layout='forward',
  headerText=['count', 'amount' , 'total' , 'Price']
}:Partial<OrderHeaderInterdace>={
  layout:'forward',
  headerText:['count', 'amount' , 'total' , 'Price']
}) {
 return (<div className="table-row table-head">
  {
    headerText?.map((x)=><span>{x}</span>)
  }
 </div>) 
}


export default OrderTableHeader
