import React from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function LoadingSpinner(props) {
  const { size, color } = props;
  const styling = `animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2`;

  return (
    <div className="loading justify-center items-center">
      <div
        className={classNames(
          color ? `border-${color}-600` : "border-blue-500",
          styling
        )}
      ></div>
    </div>
  );
}

export default LoadingSpinner;
