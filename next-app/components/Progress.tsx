import React from "react";

function Progress({ percent }) {
  return (
    <div>
      <p className="text-base pb-2">Progresss</p>
      <div
        className="radial-progress text-primary"
        style={{ "--value": percent, "--size": "10rem" }}
      >
        <div className="text-3xl">
          <p className="">{`${percent}%`}</p>
        </div>
      </div>
    </div>
  );
}

export default Progress;
