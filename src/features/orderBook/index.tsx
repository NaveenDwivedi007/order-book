import { useEffect } from "react";
import OrderHeader from "./components/OrderHeader";
import OrderTableRow from "./components/OrderTableRow";
import useWebSocket, { ReadyState } from 'react-use-websocket';
let socketUrl = 'wss://api-pub.bitfinex.com/ws/2'
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
      hello
     <OrderHeader layout={"forward"} ></OrderHeader>
     <OrderTableRow></OrderTableRow>
    </div>
  );
}

export default OrderBook;