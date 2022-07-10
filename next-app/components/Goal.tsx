import React from "react";

function Goal({ kpi, target }) {
  return (
    <div>
      <p className="text-base">Goal</p>
      <div className="flex flex-row items-end space-x-2">
        <div className="stat-value text-primary">{target}</div>
        <span className="stat-desc text-lg">{kpi}</span>
      </div>
    </div>
  );
}

export default Goal;
