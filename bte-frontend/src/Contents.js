import React from 'react';
import BallotViewer from "./BallotViewer"

class Contents extends React.Component {
render () {
  return (
  <div>
      <BallotViewer></BallotViewer>
      <img src="/Burst.png" className="burst"></img>
      
  </div>
  );
}
}

export default Contents;
