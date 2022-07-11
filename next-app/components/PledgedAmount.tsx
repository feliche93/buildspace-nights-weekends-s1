import React from "react";

function PledgedAmount({ value, asset }) {
  return (
    <div>
      <p className="text-base">Pledged Amount</p>
      <div className="flex flex-row items-end space-x-2">
        <div className="stat-value text-primary">{value}</div>
        <span className="stat-desc text-lg">{asset}</span>
      </div>
    </div>
  );
}

export default PledgedAmount;
