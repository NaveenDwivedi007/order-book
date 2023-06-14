import { useEffect, useState } from "react";
import { OrderTableRowInterface, StyleObj } from "../interfaces/orderTableRowInterfaces";
import "../orderBook.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBell } from '@fortawesome/free-solid-svg-icons'
import React from "react";



// rgba(1, 167, 129, 0.25)

function OrderTableRow({
  count=0,
  amoumt=0,
  total=0,
  price=0,
  isReversible=false,
  progressBarWidth=100
}:Partial<OrderTableRowInterface>={
  count:0,
  amoumt:0,
  total:0,
  price:0,
  isReversible:false,
  progressBarWidth:100
}) {
  const [styles,setStyles]=useState<StyleObj>({
    width:`${progressBarWidth}%`,
    backgroundColor:'rgba(1, 167, 129, 0.5)',
    right:0
  })
  useEffect(()=>{
    if (isReversible) {
      setStyles((styleObj)=>{
        return {
          ...styleObj,
          width:progressBarWidth+'%',
          backgroundColor:'rgba(228, 75, 68, 0.5)',
          left:0,
        }
      })
    }else{
      setStyles((styleObj:any)=>{
        delete styleObj.left
        return {
          ...styleObj,
          backgroundColor:'rgba(1, 167, 129, 0.5)',
          width:progressBarWidth+'%',
          right:0
        }
      })
    }

  },[isReversible,progressBarWidth])
  return (
    <div className="table-data-row-container">
      <div className="table-data-row-overlay" style={styles}></div>
      <div className={"table-data-row table-row " +(isReversible?'reverse':null)}   >
        <span className="table-cell" >
          <button className='action-btn'>
            <FontAwesomeIcon icon={faBell} style={{color: "#f2f2f2",}} />
          </button>
        </span>
        <span className="table-cell" >
          {count}
        </span>
        <span className="table-cell" >
          {amoumt}
        </span>
        <span className="table-cell" >
          {total}
        </span>
        <span className="table-cell" >
          {price}
        </span>
      </div>
    </div>
  )
}


export default React.memo(OrderTableRow)