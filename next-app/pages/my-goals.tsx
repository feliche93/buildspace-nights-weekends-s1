import React from "react";
import GoalCard from "../components/goals/GoalCard";

function MyGoals() {
  const goals = [
    {
      status: "pending",
      kpi: "Status Updates",
      target: 8,
      percent: 35,
      walletAddress: "0xA7828C5BAb02C879Ceb555F567d1833b34E1402B",
      endDate: "July 19, 2022 03:24:00",
    },
    {
      status: "success",
      kpi: "Status Updates",
      target: 12,
      percent: 100,
      walletAddress: "0xA7828C5BAb02C879Ceb555F567d1833b34E1402B",
      endDate: "July 1, 2022 03:24:00",
    },
    {
      status: "failed",
      kpi: "Status Updates",
      target: 8,
      percent: 10,
      walletAddress: "0xA7828C5BAb02C879Ceb555F567d1833b34E1402B",
      endDate: "July 1, 2022 03:24:00",
    },
  ];

  return (
    <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {goals.map((goal, index) => (
          <GoalCard key={index} {...goal} />
        ))}
      </div>
    </main>
  );
}

export default MyGoals;
