import React from "react";
import { useForm } from "react-hook-form";
import {
  useMoralis,
  useNewMoralisObject,
  useMoralisQuery,
} from "react-moralis";
import { usePlausible } from "next-plausible";

export default function CreateGoal() {
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
    plausible("goalCreated");

    data.startDate = new Date(data.startDate).toISOString();
    data.endDate = new Date(data.endDate).toISOString();
    data.progress = 0;
    data.percent = 0;
    data.userId = user?.id;
    data.status = "pending";

    console.log(data);

    await save({
      ...data,
    });

    console.log("error", error);
  };

  return (
    <div className="p-0 md:p-5">
      <h1 className="text-center text-2xl text-primary pb-5">Create a goal</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Twitter username */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">What is your twitter username?</span>
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
          {/* KPI Selection */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Pick a goal target</span>
            </label>
            <select
              {...register("kpi", { required: true })}
              className="select select-bordered"
              defaultValue={"Status Updates"}
            >
              <option value="statusUpdates">Status Updates</option>
            </select>
            <label className="label">
              <span className="label-text-alt">
                This will be the KPI you will need to meet.
              </span>
            </label>
          </div>

          {/* KPI Amount */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Total number of status updates</span>
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

          {/* KPI Amount */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Amount of USDC pledged</span>
            </label>
            <input
              {...register("pledged", { required: true, min: 1 })}
              defaultValue={1}
              type="number"
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
  );
}
