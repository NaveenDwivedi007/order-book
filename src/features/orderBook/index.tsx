import { useEffect, useState } from "react";
import OrderTableHeader from "./components/OrderTableHeader";
import OrderTableRow from "./components/OrderTableRow";
import useWebSocket from 'react-use-websocket';
import OrderHeader from "./components/OrderHeader";
import OrderFooter from "./components/OrderFooter";
import { SocketResponse } from "./interfaces/clientResponseInterface";
import { OrderTableRowInterface } from "./interfaces/orderTableRowInterfaces";
let socketUrl = 'wss://api-pub.bitfinex.com/ws/2'



function OrderBook() {
  const [buyArr,setBuyArr]=useState<OrderTableRowInterface[]>(new Array(15).fill(null))
  const [sellArr,setSellArr]=useState<OrderTableRowInterface[]>(new Array(15).fill(null))
  const [buyObj,setBuyObj]= useState<{[key:string|number]:OrderTableRowInterface}>({})
  const [sellObj,setSellObj]= useState<{[key:string|number]:OrderTableRowInterface}>({})


  const {
    sendMessage
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('connected to websocket'),
    onClose:() => console.log('webSocket close trying to reconnect'),
    shouldReconnect: () => true,
    onMessage: (event: WebSocketEventMap['message']) =>  {      
      let temp:SocketResponse = JSON.parse(event?.data);
      orderBookArrHelper(temp[1])
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
    let [price,count,amount] = orderDetails
    orderDetails[0] = Math.floor(price)
    if (!price) return
    if (count){
      if (amount<0) {
        setSellObjHandler(orderDetails)
      }else{
        setBuyObjHandler(orderDetails)
      }
    }
  }

  function setSellObjHandler(orderDetails:[number,number,number]) {
    let [price,count,amount] = orderDetails
    if (!price) return
    if (sellObj[price] && amount === 0 ) {
      let tempObj = {...sellObj} 
      delete tempObj[price]
      setSellObj(tempObj)
    }
    amount = Math.round(-1*amount*100)/100
    let total = Math.floor((count*amount)*100)/100
    let tempObj = sellObj[price]
    if (tempObj ) {
      if (tempObj.count !== count || tempObj.amount !== amount) {
        tempObj = {
          ...tempObj,
          count,
          amount,
          total:total,
          isReversible:true,
          price
        }
      }else{
        return
      }
    }else{
      tempObj = {
        count,
        amount,
        total:total,
        isReversible:true,
        progressBarWidth:100,
        price
      }
    }
    setSellObj((val)=>{
      val[price] = tempObj
      return {...val}
    })
  }
  function setBuyObjHandler(orderDetails:[number,number,number]) {
    let [price,count,amount] = orderDetails
    if (!price) return
    if (buyObj[price] && amount === 0 ) {
      let tempObj = {...buyObj} 
      delete tempObj[price]
      setBuyObj(tempObj)
    }
    amount = Math.round(amount*100)/100
    let total = Math.floor((count*amount)*100)/100
    let tempObj = buyObj[price]
    if (tempObj ) {
      if (tempObj.count !== count || tempObj.amount !== amount) {
        tempObj = {
          ...tempObj,
          count,
          amount,
          total:total,
          isReversible:false,
          price
        }
      }else{
        return
      }
    }else{
      tempObj = {
        count,
        amount,
        total:total,
        isReversible:false,
        progressBarWidth:100,
        price
      }
    }
    setBuyObj((val)=>{
      val[price] = tempObj
      return {...val}
    })
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
        {Object.keys(buyObj).sort((a,b)=>{
          return buyObj[a].total - buyObj[b].total
        }).map((x,i)=>
          (
            <OrderTableRow key={x} {...buyObj[x]} price={x} ></OrderTableRow>)
          )}
      </div>
      <div className="order-book-buy-sell-section">
        <OrderTableHeader layout={"reverse"} ></OrderTableHeader>
        
        {Object.keys(sellObj).sort((a,b)=>{
          return sellObj[a].total - sellObj[b].total
        }).map((x,i)=>
          (
            <OrderTableRow key={x} {...sellObj[x]} price={x} ></OrderTableRow>)
          )}
      </div>
      </div>
      <OrderFooter></OrderFooter>
    </div>
  );
}

export default OrderBook;