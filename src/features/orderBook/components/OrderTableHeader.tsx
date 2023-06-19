import React from "react"
import { OrderHeaderInterdace } from "../interfaces/orderHeaderInterfaces"
import '../orderBook.css'

function OrderTableHeader({
  layout='forward',
  headerText=['count', 'amount' , 'total' , 'Price']
}:Partial<OrderHeaderInterdace>={
  layout:'forward',
  headerText:['count', 'amount' , 'total' , 'Price']
}) {
 return (<div className={`table-row table-head ${layout}`}>
  <span className="table-cell"></span>
  {
    headerText?.map((x)=><span key={x} className="table-cell">{x}</span>)
  }
 </div>) 
}

export default React.memo(OrderTableHeader)