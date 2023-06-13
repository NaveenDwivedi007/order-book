import { useEffect } from "react";
import OrderTableHeader from "./components/OrderTableHeader";
import OrderTableRow from "./components/OrderTableRow";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import OrderHeader from "./components/OrderHeader";
import OrderFooter from "./components/OrderFooter";
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
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('connected to websocket'),
    onClose:() => console.log('webSocket close trying to reconnect'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) =>  {
      let temp = JSON.parse(event?.data)
      console.log({temp});
      
      
    }
  });
  useEffect(()=>{
    sendMessage(JSON.stringify({ event: "conf", flags: 65536 + 131072 }))
    let msg = JSON.stringify( {
      event: "subscribe",
      channel: "book",
      symbol: 'tBTCUSD',
      prec: "P0",
      len: 25,
      freq: "F0",
      subId: 123,
    })
    sendMessage(msg)
  },[sendMessage])


  return (
    <div className="order-book">
      <OrderHeader></OrderHeader>
      <div className="order-book-container">
      <div className="order-book-buy-sell-section">
        <OrderTableHeader layout={"forward"} ></OrderTableHeader>
        <OrderTableRow progressBarWidth={width}></OrderTableRow>
      </div>
      <div className="order-book-buy-sell-section">
        <OrderTableHeader layout={"reverse"} ></OrderTableHeader>
        <OrderTableRow progressBarWidth={width} isReversible={true} ></OrderTableRow>
      </div>
      </div>
      <OrderFooter></OrderFooter>
    </div>
  );
}

export default OrderBook;