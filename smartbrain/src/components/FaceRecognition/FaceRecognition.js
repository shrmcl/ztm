import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, box }) => {
  let allFaces;
  if (box.length) {
    allFaces = box.map((el, id) => {
      return (
        <div
          key = {id}
          className="face-borders"
          style={{
            top: el.topRow,
            right: el.rightCol,
            bottom: el.bottomRow,
            left: el.leftCol
          }}
        />
      );
    })
  }

  return (
   <div className="center ma">
     <div className="absolute mt2">
      <img id="inputimage" 
        src={imageUrl} 
        alt="" 
        width="500px" 
        height="auto" 
      />
      <div>{ allFaces }</div>
     </div>
   </div>
  )
}

export default FaceRecognition