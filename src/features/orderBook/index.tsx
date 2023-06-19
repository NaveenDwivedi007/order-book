import { useEffect, useState } from "react";
import OrderTableHeader from "./components/OrderTableHeader";
import OrderTableRow from "./components/OrderTableRow";
import useWebSocket from 'react-use-websocket';
import OrderHeader from "./components/OrderHeader";
import OrderFooter from "./components/OrderFooter";
import { ResponseTransformObject, SocketResponse } from "./interfaces/clientResponseInterface";
import { OrderTableRowInterface } from "./interfaces/orderTableRowInterfaces";
import Loader from "../../components/Loader";
import { OrderBookInterface } from "./interfaces/orderBookInterface";
let socketUrl = 'wss://api-pub.bitfinex.com/ws/2'



function OrderBook({pair='BTCUSD'}:Partial<OrderBookInterface>={
  pair:'BTCUSD'
}) {
  const [buyObj, setBuyObj] = useState<ResponseTransformObject>({})
  const [sellObj, setSellObj] = useState<ResponseTransformObject>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)


  const {
    sendMessage
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('connected to websocket'),
    onClose: () => {
      setIsLoading(true)
      console.log('webSocket close trying to reconnect')
    },
    shouldReconnect: () => true,
    onMessage: (event: WebSocketEventMap['message']) => {
      let temp: SocketResponse = JSON.parse(event?.data);
      orderBookArrHelper(temp[1])
    }
  });

  useEffect(() => {
    sendMessage(JSON.stringify({ event: "conf", flags: 65536 + 131072 }))
    let msg = JSON.stringify({
      event: "subscribe",
      channel: "book",
      // symbol: 'tBTCUSD',
      pair: pair,
      prec: "P0",
      len: 25,
      freq: "F0",
    })
    sendMessage(msg)
  }, [sendMessage])

  useEffect(() => {
    if (isLoading) {
      if (Object.keys(buyObj).length && Object.keys(sellObj).length) {
        setIsLoading(false)
      }
    }
  }, [buyObj, isLoading, sellObj])

  function orderBookArrHelper(orderDetails: [number, number, number] | string) {
    if (!orderDetails || typeof (orderDetails) === 'string') return
    let [price, count, amount] = orderDetails
    orderDetails[0] = Math.floor(price)
    if (!price) return
    if (count) {
      if (amount < 0) {
        setSellObjHandler(orderDetails)
      } else {
        setBuyObjHandler(orderDetails)
      }
    }
  }

  function setSellObjHandler(orderDetails: [number, number, number]) {
    let [price, count, amount] = orderDetails
    if (!price) return
    amount = Math.round(-1 * amount * 100) / 100
    if (amount === 0 || amount === -0) {
      if (sellObj[price]) {
        let tempObj = { ...sellObj }
        delete tempObj[price]
        setSellObj(() => {
          return { ...tempObj }
        })
      }
      return
    }
    let total = Math.floor((count * amount) * 100) / 100
    let tempObj = sellObj[price]
    if (tempObj) {
      if (tempObj.count !== count || tempObj.amount !== amount) {
        tempObj = {
          ...tempObj,
          count,
          amount,
          total: total,
          isReversible: true,
          price,

        }
      } else {
        return
      }
    } else {
      tempObj = {
        count,
        amount,
        total: total,
        isReversible: true,
        price,

      }
    }
    setSellObj((val) => {
      val[price] = tempObj
      return { ...val }
    })
  }
  function setBuyObjHandler(orderDetails: [number, number, number]) {
    let [price, count, amount] = orderDetails
    if (!price) return
    if (buyObj[price] && amount === 0) {
      let tempObj = { ...buyObj }
      delete tempObj[price]
      setBuyObj(tempObj)
    }
    amount = Math.round(amount * 100) / 100
    let total = Math.floor((count * amount) * 100) / 100
    let tempObj = buyObj[price]
    if (tempObj) {
      if (tempObj.count !== count || tempObj.amount !== amount) {
        tempObj = {
          ...tempObj,
          count,
          amount,
          total: total,
          isReversible: false,
          price,
        }
      } else {
        return
      }
    } else {
      tempObj = {
        count,
        amount,
        total: total,
        isReversible: false,
        price,
      }
    }
    setBuyObj((val) => {
      val[price] = tempObj
      return { ...val }
    })
  }
  function volumeCalculator(total: number, totals: number): number {
    return Math.min(Math.ceil(total / (totals) * 100), 90)
  }

  function toggleCollasHandler() {
    setIsCollapsed(val => !val)
  }

  function objectToArrHelper(obj: ResponseTransformObject, sortType: 'asc' | 'dec' = 'asc'): OrderTableRowInterface[] {
    if (!obj) return []
    let total = 0
    let totals = 0
    return Object.keys(obj).filter(x => {
      if (obj[x].amount && sortType === 'dec') {
        total += obj[x].amount
      }
      totals += obj[x].amount
      return obj[x].amount
    }).map(x => {
      const currObj = {...obj[x]}
      if (sortType=== 'dec') {
        currObj.total = parseFloat(total.toFixed(2))
        currObj.progressBarWidth = 100-volumeCalculator(currObj.total,totals)
        total = (total - currObj?.amount)
      }else{
        total += currObj.amount
        currObj.total = parseFloat(total.toFixed(2))
        currObj.progressBarWidth = volumeCalculator(currObj.total,totals)
      }
      return currObj
    })

  }

  return (
    <div className="order-book">
      <OrderHeader isCollapsed={isCollapsed} toggleFn={toggleCollasHandler} ></OrderHeader>
      {!isCollapsed && <div className="order-book-body">
        <div className="order-book-container">
          <div className="order-book-buy-sell-section">
            <OrderTableHeader layout={"forward"} ></OrderTableHeader>
            {!isLoading && objectToArrHelper(buyObj).map((x, i) =>
            (
              <OrderTableRow key={x.price} {...x} price={x.price} ></OrderTableRow>)
            )}
          </div>
          <div className="order-book-buy-sell-section">
            <OrderTableHeader layout={"reverse"} ></OrderTableHeader>

            {!isLoading && objectToArrHelper(sellObj, 'dec').map((x, i) =>
            (
              <OrderTableRow key={x.price} {...x} price={x.price} ></OrderTableRow>)
            )}
          </div>
        </div>
        {isLoading && <div className="loader">
          <Loader isImageVisible={false} />
        </div>}
        <OrderFooter></OrderFooter>
      </div>}
    </div>
  );
}

export default OrderBook;