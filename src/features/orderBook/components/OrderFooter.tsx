import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowRestore,faCircle } from '@fortawesome/free-solid-svg-icons'
function OrderFooter() {
  return (
    <div className="order-footer">
      <button className='popup-btn' >
        <FontAwesomeIcon icon={faWindowRestore} style={{color: "#f2f2f2",}}/>
      </button>
      <span className="order-indicator">
        <span className="order-book-type">
          full Book 
        </span>
        <span>|</span>
        <span className="data-flow-indicator">
          <FontAwesomeIcon className='indicator-icon' icon={faCircle} />
          <span title="WebSocket is Connected" className="datat-flow-connection-type">
            real-time
          </span>

        </span>
      </span>
    </div>
  )
}
export default OrderFooter