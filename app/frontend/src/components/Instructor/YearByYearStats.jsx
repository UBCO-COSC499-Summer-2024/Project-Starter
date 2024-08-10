import React, { useState } from "react";
import { useTheme } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons"; // Import specific icon
import InstructorYearlyTest from "../Modules/InstructorYearlyTestModule";

function YearByYearStats(props) {
  let asPercents = props.asPercents;
  let setAsPercents = props.setAsPercents;
  const { theme } = useTheme();
  console.log(props.yearByYearInfo.yearByYearGrades);
  if (props.yearByYearInfo.show) {
    return (
      <div className="bg-[rgba(0,_0,_0,_0.25)] fixed top-[0%] left-[0%] w-[100%] h-[100%]">
        <div className = {`${theme === "dark" ? "bg-gray-900" : "bg-gray-200"} fixed top-[10%] left-[10%] w-[80%] h-[80%] text-left border-[2px] border-[solid] border-gray-500`}>
          <button
            className="float-right m-4 "
            onClick={props.handleYearByYearClose}
          >
            Close
          </button>
          <h3 className="ml-8 my-4 text-[24px]">
            Viewing previous statistics for {props.yearByYearInfo.department}-
            {props.yearByYearInfo.code}: {props.yearByYearInfo.name}
          </h3>
          <button
            className={`w-[200px] mx-[5%] text-center p-4 rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 text-white hover:bg-gray-600"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
            onClick={() => {
              setAsPercents(!asPercents);
            }}
          >
            <FontAwesomeIcon icon={faPercent} className="mr-2" />
            Toggle percents
          </button>
          <div className = "ml-[5%] mt-[1%] w-[90%] overflow-y-scroll h-[70%]">
          <table
            className="w-[100%] text-left border-separate "
            style={{ borderSpacing: "0 10px" }}
          >
            <thead>
              <tr></tr>
              <tr>
                <th
                  className={`p-4 ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Course Start Date
                </th>
                <th
                  className={`p-4 ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Section
                </th>
                <th
                  className={`p-4 text-center ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Mean
                </th>
                <th
                  className={`p-4 text-center ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Stdev
                </th>
                <th
                  className={`p-4 text-center ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Min
                </th>
                <th
                  className={`p-4 text-center ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Q1
                </th>
                <th
                  className={`p-4 text-center ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Median
                </th>
                <th
                  className={`p-4 text-center ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Q3
                </th>
                <th
                  className={`p-4 text-center ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Max
                </th>
                <th
                  className={`p-4 text-center ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {props.yearByYearInfo.yearByYearGrades.map((grades, index) => {
                return (
                  <InstructorYearlyTest
                    key={index}
                    grades={grades}
                    asPercents={asPercents}
                  />
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default YearByYearStats;
