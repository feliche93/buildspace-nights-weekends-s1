import React from "react";
import Blockies from "react-blockies";

function GoalOwner({ walletAddress }) {
  return (
    <div>
      <p className="text-base pb-2">Goal Owner</p>
      <div className="flex flex-row items-end space-x-2">
        <Blockies className="rounded" seed={walletAddress} />
        <span className="stat-desc text-base">
          {walletAddress.substr(0, 7)}...
          {walletAddress.substr(walletAddress.length - 7)}
        </span>
      </div>
    </div>
  );
}

export default GoalOwner;
