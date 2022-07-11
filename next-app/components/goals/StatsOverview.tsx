import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import React from "react";

function StatsOverview() {
  return (
    <div className="stats stats-vertical w-full max-w-xs sm:max-w-none md:stats-horizontal sm:w-auto shadow bg-base-300">
      <div className="stat">
        <div className="stat-figure text-success">
          <CheckCircleIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Reached Goals</div>
        <div className="stat-value text-success">12</div>
        <div className="stat-desc">21% more than average</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-error">
          <XCircleIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Not Reached Goals</div>
        <div className="stat-value text-error">0</div>
        <div className="stat-desc">21% more than last month</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-primary">
          <CurrencyDollarIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Total Pledged (USD)</div>
        <div className="stat-value text-primary">70</div>
        <div className="stat-desc">Top 5%</div>
      </div>
    </div>
  );
}

export default StatsOverview;
