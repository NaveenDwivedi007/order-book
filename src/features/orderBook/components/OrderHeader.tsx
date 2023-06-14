import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown,faMagnifyingGlassMinus,faMagnifyingGlassPlus,faBell,faGear } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
function OrderHeader() {
  return (
    <div className='order-header'>
      <div className="section">
        <button  className='action-btn'>
          <FontAwesomeIcon icon={faChevronDown} style={{color: "#f2f2f2",}} />
        </button>
        <span className="order-type">
          <span>order book</span>  
          <span className="order-of">
            {/* TODO: need to be dynamic */}
             btc/usd 
          </span>
        </span>
      </div>
      <div className="section action">
        <button className='action-btn'>
          <FontAwesomeIcon icon={faBell} style={{color: "#f2f2f2",}} />
        </button>
        <button className='action-btn'>
          <FontAwesomeIcon icon={faGear} style={{color: "#f2f2f2",}}/>
        </button>
        <button className='action-btn'>
          <FontAwesomeIcon icon={faMagnifyingGlassPlus} style={{color: "#f2f2f2",}} />
        </button>
        <button className='action-btn'>
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} style={{color: "#f2f2f2",}} />
        </button>
      </div>
    </div>
  )
}

export default React.memo(OrderHeader)