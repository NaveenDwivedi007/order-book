import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faMagnifyingGlassMinus, faMagnifyingGlassPlus, faBell, faGear } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import { OrderBookHeaderInterface } from '../interfaces/orderBookHeaderInterface'

function OrderHeader({
  toggleFn = () => { },
  isCollapsed = false,
  pairText = 'BTCUSD'
}: Partial<OrderBookHeaderInterface> = {
    toggleFn: function () { },
    isCollapsed: false,
    pairText: 'BTCUSD'
  }) {
  const [pair, setPair] = useState('')
  // TODO: move to utils
  useEffect(() => {
    if (!pair) {
      let str = ''
      for (let i = 0; i < pairText.length; i++) {
        str += pairText[i]
        if (i === 2) {
          str += '/'
        }
      }
      setPair(str)
    }
  }, [pairText])

  function actionControlHandler(event:React.MouseEvent,cb:Function=()=>{}) {
    event.stopPropagation()
    cb()
    
  }
  return (
    <div className='order-header' onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      toggleFn(e)
    }}>
      <div className="section">
        <button className='action-btn'>
          <FontAwesomeIcon className={isCollapsed ? `action-collapse-icon` : undefined} icon={faChevronDown} style={{ color: "#f2f2f2", }} />
        </button>
        <span className="order-type">
          <span>order book</span>
          <span className="order-of">
            {pair}
          </span>
        </span>
      </div>
      {!isCollapsed && <div className="section action">
        <button className='action-btn' onClick={(event)=>{
          actionControlHandler(event,()=>{
            console.log('Bell icon clicked');
            
          })
        }}>
          <FontAwesomeIcon icon={faBell} style={{ color: "#f2f2f2", }} />
        </button>
        <button className='action-btn' onClick={(event)=>{
          actionControlHandler(event)
        }}>
          <FontAwesomeIcon icon={faGear} style={{ color: "#f2f2f2", }} />
        </button>
        <button className='action-btn' onClick={(event)=>{
          actionControlHandler(event)
        }}>
          <FontAwesomeIcon icon={faMagnifyingGlassPlus} style={{ color: "#f2f2f2", }} />
        </button>
        <button className='action-btn' onClick={(event)=>{
          actionControlHandler(event)
        }}>
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} style={{ color: "#f2f2f2", }} />
        </button>
      </div>}
    </div>
  )
}

export default React.memo(OrderHeader)