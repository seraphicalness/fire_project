import React from "react";
import "../css/Event.css";

const Event = () => {
  const boxes = Array.from({ length: 6 }); // 6개의 박스를 생성합니다.

  return (
    <div className="eventbox">
      <div className="eventrect" />
      <br/>
      <div className="box-container">
        {boxes.map((_, index) => (
          <div key={index} className="small-box" />
        ))}
      </div>
    </div>
  );
};

export default Event;
