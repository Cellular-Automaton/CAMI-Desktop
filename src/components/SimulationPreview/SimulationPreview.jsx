import React from "react";
import Star from "../../../assets/images/star.svg";

export default function SimulationResume({ simulation, last, favorite }) {
  function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }
  return (
    <div className="flex flex-col h-full w-64 overflow-hidden gap-1">
      <div id="image" className="bg-white w-full h-40 rounded-lg relative">
        {favorite ? (
          <button id="favorite">
            <img
              src={Star}
              className="absolute top-0 right-0 p-1 text-xs"
            ></img>
          </button>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        <div className="flex flex-row w-full justify-between text-sm">
          <div
            id="name"
            className={`text-left text-ellipsis overflow-hidden truncate ${last ? "w-1/2" : "w-full"} text-white`}
          >
            {simulation.name}
          </div>
          {last ? (
            <div
              id="steps"
              className="text-right text-ellipsis overflow-hidden text-white"
            >
              {simulation.steps} steps
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div>
          {last ? (
            <div id="date" className="text-sm text-right text-midnight-text">
              {timeAgo(simulation.date)}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
