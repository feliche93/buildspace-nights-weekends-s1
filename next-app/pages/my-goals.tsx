import Link from "next/link";
import React from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import GoalCard from "../components/goals/GoalCard";
import StatsOverview from "../components/goals/StatsOverview";

function MyGoals() {
  const { user } = useMoralis();
  const [account] = user ? user.get("accounts") : [];
  const { data, error, isLoading } = useMoralisQuery(
    "Goals",
    (query) => query.equalTo("userId", user?.id),
    [user?.id]
  );

  console.log(data);

  const goals = data?.map((goal) => ({
    status: goal.get("status"),
    kpi: goal.get("kpi"),
    target: goal.get("target"),
    endDate: goal.get("endDate"),
    pledged: goal.get("pledged"),
    percent: goal.get("percent"),
  }));

  // const goals = [
  //   {
  //     status: "pending",
  //     kpi: "Status Updates",
  //     pledged: "10",
  //     target: 8,
  //     percent: 35,
  //     walletAddress: "0xA7828C5BAb02C879Ceb555F567d1833b34E1402B",
  //     endDate: "July 19, 2022 03:24:00",
  //   },
  //   {
  //     status: "pending",
  //     kpi: "Status Updates",
  //     pledged: "10",
  //     target: 8,
  //     percent: 35,
  //     walletAddress: "0xA7828C5BAb02C879Ceb555F567d1833b34E1402B",
  //     endDate: "July 19, 2022 03:24:00",
  //   },
  //   {
  //     status: "success",
  //     kpi: "Status Updates",
  //     pledged: "10",
  //     target: 12,
  //     percent: 100,
  //     walletAddress: "0xA7828C5BAb02C879Ceb555F567d1833b34E1402B",
  //     endDate: "July 1, 2022 03:24:00",
  //   },
  //   {
  //     status: "failed",
  //     kpi: "Status Updates",
  //     pledged: "10",
  //     target: 8,
  //     percent: 10,
  //     walletAddress: "0xA7828C5BAb02C879Ceb555F567d1833b34E1402B",
  //     endDate: "July 1, 2022 03:24:00",
  //   },
  // ];

  return (
    <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
      <div className="pb-10 flex flex-col items-center space-y-10">
        <StatsOverview />
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {goals.map((goal, index) => (
              <GoalCard key={index} {...goal} walletAddress={account} />
            ))}
          </div>
        ) : (
          <Link href={"/create-goal"}>
            <a className="btn btn-primary">Create First Goal</a>
          </Link>
        )}
      </div>
    </main>
  );
}

export default MyGoals;
