import React from "react";
import { useForm } from "react-hook-form";
import {
  useMoralis,
  useNewMoralisObject,
  useMoralisQuery,
} from "react-moralis";
import { Contract, ethers } from "ethers";
// import GoalContractV0 as GoalContractV0Local from "../../hardhat/deployments/loalhost/GoalContractV0.json";
import GoalContractV1 from "../../hardhat/deployments/localhost/GoalContractV1.json";

import { usePlausible } from "next-plausible";

export default function CreateGoal() {
  const { Moralis } = useMoralis();
  const provider = Moralis.web3;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { user } = useMoralis();
  const { isSaving, error, save } = useNewMoralisObject("Goals");
  const plausible = usePlausible();

  const onSubmit = async (data) => {
    const web3Provider = await Moralis.enableWeb3();
    const signer = web3Provider.getSigner();

    let contract = new ethers.Contract(
      GoalContractV1.address,
      GoalContractV1.abi,
      signer
    );

    let transaction = await contract.createGoalRequest(
      data.goal,
      parseInt(data.target),
      data.username,
      parseInt((new Date(data.startDate).getTime() / 1000).toFixed(0)),
      parseInt((new Date(data.endDate).getTime() / 1000).toFixed(0)),
      { value: ethers.utils.parseEther(data.amountPledged) }
    );

    contract.on("GoalRequestCreated", (goalRequest) => {
      console.log(`GoalRequestCreated: ${goalRequest.target}`);
    });

    contract.on("GoalCreated", (goalRequest) => {
      console.log(`GoalCreated: ${goalRequest.fufilled}`);
    });

    plausible("goalCreated");

    // data.startDate = ;
    // data.endDate = parseInt(
    //   (new Date(data.endDate).getTime() / 1000).toFixed(0)
    // );
    // data.progress = 0;
    // data.percent = 0;
    // data.status = "pending";

    // data.userId = user?.id;

    // console.log(data);

    // await save({
    //   ...data,
    // });
    if (error) console.log("error", error);
  };

  return (
    <>
      <div className="p-0 md:p-5">
        <h1 className="text-center text-2xl text-primary pb-5">
          Create a goal
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Twitter username */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">
                  What is your twitter username?
                </span>
              </label>
              <input
                {...register("username", {
                  required: true,
                })}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text-alt">
                  Please enter without the @ sign.
                </span>
              </label>
            </div>
            {/* goal Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Pick a goal target</span>
              </label>
              <select
                {...register("goal", { required: true })}
                className="select select-bordered"
                defaultValue={"Status Updates"}
              >
                <option value="statusUpdates">Status Updates</option>
              </select>
              <label className="label">
                <span className="label-text-alt">
                  This will be the goal you will need to meet.
                </span>
              </label>
            </div>

            {/* goal Amount */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">
                  Total number of status updates
                </span>
              </label>
              <input
                {...register("target", { required: true, min: 1 })}
                defaultValue={1}
                type="number"
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text-alt">
                  Please enter without the @ sign.
                </span>
              </label>
            </div>

            {/* Start Date */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                {...register("startDate", { required: true })}
                type="date"
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text-alt">
                  Start date on when your challenge starts.
                </span>
              </label>
            </div>

            {/* End Date */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                {...register("endDate", { required: false })}
                type="date"
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text-alt">
                  End date on when your challenge starts.
                </span>
              </label>
            </div>

            {/* Goal Amount */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Amount of USDC pledged</span>
              </label>
              <input
                {...register("amountPledged", { required: true, min: 0.001 })}
                defaultValue={1}
                type="float"
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text-alt">
                  Please enter an amount of USDC you pledge to reach your goal.
                </span>
              </label>
            </div>
          </div>
          {/* Submitt Button */}
          <div className="pt-5">
            {isSaving ? (
              <button className="btn btn-primary loading" type="submit">
                Create
              </button>
            ) : (
              <button className="btn btn-primary" type="submit">
                Create
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
