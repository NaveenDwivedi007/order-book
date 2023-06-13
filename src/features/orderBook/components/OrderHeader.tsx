import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown,faMagnifyingGlassMinus,faMagnifyingGlassPlus,faBell,faGear } from '@fortawesome/free-solid-svg-icons'
function OrderHeader() {
  return (
    <div className='order-header'>
      <div className="section">
        <FontAwesomeIcon icon={faChevronDown} style={{color: "#f2f2f2",}} />
        <span className="order-type">
          <span>order book</span>  
          <span className="order-of">
            {/* TODO: need to be dynamic */}
             btc/usd 
          </span>
        </span>
      </div>
      <div className="section action">
      <FontAwesomeIcon icon={faBell} style={{color: "#f2f2f2",}} />
      <FontAwesomeIcon icon={faGear} style={{color: "#f2f2f2",}}/>
      <FontAwesomeIcon icon={faMagnifyingGlassPlus} style={{color: "#f2f2f2",}} />
      <FontAwesomeIcon icon={faMagnifyingGlassMinus} style={{color: "#f2f2f2",}} />

      </div>
    </div>
  )
}

export default OrderHeader