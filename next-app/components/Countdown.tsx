import React from "react";
import { useCountdown } from "../libs/useCountdown";

function Countdown({ endDate }) {
  const [days, hours, minutes, seconds] = useCountdown(endDate);
  return (
    <div>
      <p className="text-base pb-1">Time remaining</p>
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl text-primary">
            <span style={{ "--value": days > 0 ? days : 0 }}></span>
          </span>
          <span className="stat-desc text-sm">days</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl text-primary">
            <span style={{ "--value": hours > 0 ? hours : 0 }}></span>
          </span>
          <span className="stat-desc text-sm">hours</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl text-primary">
            <span style={{ "--value": minutes > 0 ? minutes : 0 }}></span>
          </span>
          <span className="stat-desc text-sm">min</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-4xl text-primary">
            <span style={{ "--value": seconds > 0 ? seconds : 0 }}></span>
          </span>
          <span className="stat-desc text-sm">sec</span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
