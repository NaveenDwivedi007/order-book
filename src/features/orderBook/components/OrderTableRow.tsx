import { OrderTableRowInterface } from "../interfaces/orderTableRowInterfaces";
import "../orderBook.css"

let width = 20;
setInterval(()=>{
  if (width<100) {
    // width+=10
  }else{
    // width-=80
  }
},1000)

function OrderTableRow({
  count=0,
  amoumt=0,
  total=0,
  price=0,
  isReversible=false,
}:Partial<OrderTableRowInterface>={
  count:0,
  amoumt:0,
  total:0,
  price:0,
  isReversible:false,
}) {
  return (
    <div className="table-data-row-container">
      <div className="table-data-row-overlay" style={{
        width:`${width}%`,
        backgroundColor:'red',
        right:0
      }}></div>
      <div className="table-data-row table-row"  >
        <span>
          {count}
        </span>
        <span>
          {amoumt}
        </span>
        <span>
          {total}
        </span>
        <span>
          {price}
        </span>
      </div>
    </div>
  )
}


export default OrderTableRow