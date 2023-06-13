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
    }
  });
  useEffect(()=>{
    let msg = JSON.stringify({ 
      event: 'subscribe', 
      channel: 'book', 
      symbol: 'tBTCUSD' 
    })
    sendMessage(msg)
  },[sendMessage])


  return (
    <div className="order-book">
      <OrderHeader></OrderHeader>
      <OrderTableHeader layout={"forward"} ></OrderTableHeader>
      <OrderTableRow progressBarWidth={width}></OrderTableRow>
      <OrderTableHeader layout={"forward"} ></OrderTableHeader>
      <OrderTableRow progressBarWidth={width} isReversible={true} ></OrderTableRow>
      <OrderFooter></OrderFooter>
    </div>
  );
}

export default OrderBook;