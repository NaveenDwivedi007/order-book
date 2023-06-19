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
  return (
    <div className='order-header'>
      <div className="section">
        <button onClick={(e) => {
          toggleFn(e)
        }} className='action-btn'>
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
        <button className='action-btn'>
          <FontAwesomeIcon icon={faBell} style={{ color: "#f2f2f2", }} />
        </button>
        <button className='action-btn'>
          <FontAwesomeIcon icon={faGear} style={{ color: "#f2f2f2", }} />
        </button>
        <button className='action-btn'>
          <FontAwesomeIcon icon={faMagnifyingGlassPlus} style={{ color: "#f2f2f2", }} />
        </button>
        <button className='action-btn'>
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} style={{ color: "#f2f2f2", }} />
        </button>
      </div>}
    </div>
  )
}

export default React.memo(OrderHeader)