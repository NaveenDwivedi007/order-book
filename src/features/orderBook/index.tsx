import { useEffect, useState } from "react";
import OrderTableHeader from "./components/OrderTableHeader";
import OrderTableRow from "./components/OrderTableRow";
import useWebSocket from 'react-use-websocket';
import OrderHeader from "./components/OrderHeader";
import OrderFooter from "./components/OrderFooter";
import { SocketResponse } from "./interfaces/clientResponseInterface";
import { OrderTableRowInterface } from "./interfaces/orderTableRowInterfaces";
let socketUrl = 'wss://api-pub.bitfinex.com/ws/2'

let width = 20;
setInterval(()=>{
  if (width<100) {
    width+=10
  }else{
    width-=80
  }
},1000)



function OrderBook() {
  const [buyArr,setBuyArr]=useState<OrderTableRowInterface[]>(new Array(15).fill(null))
  const [sellArr,setSellArr]=useState<OrderTableRowInterface[]>(new Array(15).fill(null))

  const {
    sendMessage
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('connected to websocket'),
    onClose:() => console.log('webSocket close trying to reconnect'),
    shouldReconnect: () => true,
    onMessage: (event: WebSocketEventMap['message']) =>  {
      // console.log({event});
      
      let temp:SocketResponse = JSON.parse(event?.data)
      // console.log(temp);
    }
  });

  

  useEffect(()=>{
    // sendMessage(JSON.stringify({ event: "conf", flags: 65536 + 131072 }))
    let msg = JSON.stringify( {
      event: "subscribe",
      channel: "book",
      symbol: 'tBTCUSD',
      pair:'ETHUSD',
      prec: "P0",
      len: 25,
      freq: "F0",
      subId: 123,
    })
    sendMessage(msg)
  },[sendMessage])


  function orderBookArrHelper(orderDetails:[number,number,number]|string) {
    if(!orderDetails || typeof(orderDetails) === 'string') return
    const [price,count,amount] = orderDetails
    if (count){
      if (amount<0) {
        setSellArr([])
      }else{
        setBuyArr([])
      }
    } 
  }

  function OrderBookSortedAndVolumeCalcuated(orderDataRow:OrderTableRowInterface[]):OrderTableRowInterface[] {
    let orderBookRow = orderDataRow.sort((a,b)=>a.total-b.total)
    const maxTotal = orderBookRow[orderBookRow.length-1].total
    const minTotal = orderBookRow[0].total
    return orderBookRow.map(x=>{
      x.progressBarWidth = x.total/(Math.max(maxTotal,30)-minTotal)
      return {...x}
    })
  }

  return (
    <div className="order-book">
      <OrderHeader></OrderHeader>
      <div className="order-book-container">
      <div className="order-book-buy-sell-section">
        <OrderTableHeader layout={"forward"} ></OrderTableHeader>
        {buyArr.map((x,i)=>
          (
            <OrderTableRow progressBarWidth={width}></OrderTableRow>)
          )}
      </div>
      <div className="order-book-buy-sell-section">
        <OrderTableHeader layout={"reverse"} ></OrderTableHeader>
        
        {sellArr.map((x,i)=>
            <OrderTableRow progressBarWidth={width} isReversible={true} ></OrderTableRow>
          )}
      </div>
      </div>
      <OrderFooter></OrderFooter>
    </div>
  );
}

export default OrderBook;