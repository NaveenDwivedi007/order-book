import "../orderBook.css"

let width = 0;
setInterval(()=>{
  if (width<100) {
    width+=10
  }else{
    width-=80
  }
},1000)

function OrderTableRow() {
  return (
    <div className="table-data-row-container">
    <div className="table-data-row-overlay" style={{
      width:`${width}%`,
      backgroundColor:'red',
      right:0
    }}></div>
    <div className="table-data-row table-row"  >
      <span>
        25
      </span>
      <span>
        25
      </span>
      <span>
        25
      </span>
      <span>
        25
      </span>
    </div>
    </div>
  )
}


export default OrderTableRow