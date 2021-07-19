import React from 'react'

const Scroll = (props) => {
  return (
    <div style={{overflow: 'scroll', height: '800px', border: 'none'}}>
    {props.children}
  </div>
  )
}

export default Scroll