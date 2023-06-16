import { useEffect, useState } from "react";
import OrderTableHeader from "./components/OrderTableHeader";
import OrderTableRow from "./components/OrderTableRow";
import useWebSocket from 'react-use-websocket';
import OrderHeader from "./components/OrderHeader";
import OrderFooter from "./components/OrderFooter";
import { SocketResponse } from "./interfaces/clientResponseInterface";
import { OrderTableRowInterface } from "./interfaces/orderTableRowInterfaces";
import Loader from "../../components/Loader";
let socketUrl = 'wss://api-pub.bitfinex.com/ws/2'



function OrderBook() {
  const [buyObj,setBuyObj]= useState<{[key:string|number]:OrderTableRowInterface}>({})
  const [sellObj,setSellObj]= useState<{[key:string|number]:OrderTableRowInterface}>({})
  const [isLoading,setIsLoading] = useState(true)
  const [isCollapsed,setIsCollapsed ] = useState(false)


  const {
    sendMessage
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('connected to websocket'),
    onClose:() => {
      setIsLoading(true)
      console.log('webSocket close trying to reconnect')
    },
    shouldReconnect: () => true,
    onMessage: (event: WebSocketEventMap['message']) =>  {      
      let temp:SocketResponse = JSON.parse(event?.data);
      orderBookArrHelper(temp[1])
    }
  });

  useEffect(()=>{
    sendMessage(JSON.stringify({ event: "conf", flags: 65536 + 131072 }))
    let msg = JSON.stringify( {
      event: "subscribe",
      channel: "book",
      symbol: 'tBTCUSD',
      pair:'BTCUSD',
      prec: "P0",
      len: 25,
      freq: "F0",
      subId: 123,
    })
    sendMessage(msg)
  },[sendMessage])

  useEffect(()=>{
    if (isLoading) {
      if (Object.keys(buyObj).length && Object.keys(sellObj).length) {
        setIsLoading(false)
      }
    }
  },[buyObj, isLoading, sellObj])

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
    const totals = Object.values(sellObj).map(x=>x.total).filter(Boolean)
    amount = Math.round(-1*amount*100)/100
    if (amount === 0 || amount == -0) {            
      if(sellObj[price]){
        let tempObj = {...sellObj} 
        delete tempObj[price]      
        setSellObj(()=>{
          return {...tempObj}
        })
      }
      return
    }
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
          price,
          progressBarWidth:volumeCalculator(total,totals),

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
        price,
        progressBarWidth:volumeCalculator(total,totals),

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
    const totals = Object.values(sellObj).map(x=>x.total).filter(Boolean)
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
          price,

          progressBarWidth:100-volumeCalculator(total,totals)
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
        price,
        progressBarWidth:100-volumeCalculator(total,totals),
      }
    }
    setBuyObj((val)=>{
      val[price] = tempObj
      return {...val}
    })
  }
  function volumeCalculator(total:number,totals:number[]):number {
    let set:any = new Set(totals)
    return Math.min(Math.ceil(total/([...set].reduce((prev,curr)=>prev+curr,0))*100),90)
  }

  function toggleCollasHandler() {
    setIsCollapsed(val=>!val)
  }

  function objectToArrHelper(obj:{[key:string|number]:OrderTableRowInterface},sortType:'asc'|'dec'='asc'):OrderTableRowInterface[] {
    if (!obj) return []
    // if (Object.keys(obj).length>15) {
    //   let removeLength = Object.keys(buyObj).length-15
    //   let totals:number[] = []
    //   return Object.keys(obj).sort((a,b)=>{
    //     if (sortType === 'dec') return obj[b].total - obj[a].total
    //     return obj[a].total - obj[b].total
    //   }).filter((x,i)=>{
    //     if (sortType === 'dec') {
    //       if (i<removeLength) {
    //         totals.push(obj[x].total)
    //       }
    //       return  i<removeLength
    //     }
    //     totals.push(obj[x].total)
    //     return i>removeLength
    //   }).map(x=>obj[x]).map(x=>{
    //     if (sortType === 'dec') {
    //       x.progressBarWidth = 100 - volumeCalculator(x.total,totals)
    //     }else{
    //       x.progressBarWidth = volumeCalculator(x.total,totals)
    //     }
    //     return {...x}
    //   })
    // }
    return Object.keys(obj).sort((a,b)=>{
      if (sortType === 'dec') return obj[b].total - obj[a].total
        return obj[a].total - obj[b].total
    }).map(x=>obj[x]).filter(x=>x.amount)
    
  }

  return (
    <div className="order-book">
      <OrderHeader isCollapsed={isCollapsed} toggleFn={toggleCollasHandler} ></OrderHeader>
      {!isCollapsed && <div className="order-book-body">
        <div className="order-book-container">
          <div className="order-book-buy-sell-section">
            <OrderTableHeader layout={"forward"} ></OrderTableHeader>
            {!isLoading && objectToArrHelper(buyObj,'dec').map((x,i)=>
              (
                <OrderTableRow key={x.price} {...x} price={x.price} ></OrderTableRow>)
              )}
          </div>
          <div className="order-book-buy-sell-section">
            <OrderTableHeader layout={"reverse"} ></OrderTableHeader>
            
            {!isLoading && objectToArrHelper(sellObj).map((x,i)=>
              (
                <OrderTableRow key={x.price} {...x} price={x.price} ></OrderTableRow>)
              )}
          </div>
        </div>
          {isLoading && <div className="loader">
            <Loader isImageVisible={false}/>
          </div> }
        <OrderFooter></OrderFooter>
      </div>}
    </div>
  );
}

export default OrderBook;