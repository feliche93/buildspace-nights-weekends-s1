import React from "react";
import Countdown from "../../components/Countdown";
import Goal from "../../components/Goal";
import GoalOwner from "../../components/GoalOwner";
import PledgedAmount from "../../components/PledgedAmount";
import Progress from "../../components/Progress";

function GoalCard({ kpi, walletAddress, target, endDate, percent, status }) {
  return (
    <div className="card max-w-sm bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title ">{kpi} Goal </h2>
        {status === "pending" ? (
          <span className="badge badge-accent badge-outline">In Progress</span>
        ) : status === "success" ? (
          <span className="badge badge-success badge-outline">
            Goal Reached
          </span>
        ) : (
          <span className="badge badge-error badge-outline">
            Goal not reached
          </span>
        )}

        <div className="space-y-6 pt-6">
          <GoalOwner walletAddress={walletAddress} />
          <Goal kpi={kpi} target={target} />
          <Countdown endDate={endDate} />
          <PledgedAmount value={"70"} asset={"USDC"} />
          <Progress percent={percent} />
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-disabled bg-neutral">Withdraw</button>
        </div>
      </div>
    </div>
  );
}

export default GoalCard;
