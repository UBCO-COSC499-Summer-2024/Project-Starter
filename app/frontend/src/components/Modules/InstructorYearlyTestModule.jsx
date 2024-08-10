import React from "react";
import { useTheme } from "../../App";
import { fiveNumSummary, mean, stdev } from "../Instructor/stats.jsx";

function InstructorYearlyTest(props) {
  const { theme } = useTheme();
  console.log(props.grades);
  let examMean = "-";
  let examStdev = "-";
  let [min, Q1, median, Q3, max] = ["-","-","-","-","-"];
  let asPercents = props.asPercents;
  let examGrades = [];
  if (props.grades.gradeList !== "noExams") {
    for (let i = 0; i < props.grades.gradeList.length; i++) {
      if (props.grades.gradeList[i].examId !== -1) {
        if (!asPercents) {
          examGrades.push(props.grades.gradeList[i].studentScore / 1.0);
        } else {
          examGrades.push(
            (100 * props.grades.gradeList[i].studentScore) /
              props.grades.gradeList[i].maxScore
          );
        }
      }
    }
    console.log(examGrades);
    examMean = examGrades.length > 0 ? mean(examGrades).toFixed(2) : "-";
    examStdev = examGrades.length > 1 ? stdev(examGrades).toFixed(2) : "-";
    if(examGrades.length > 0) {
      let sumarry =  fiveNumSummary(examGrades);
      min = sumarry[0].toFixed(2);
      Q1 = sumarry[1].toFixed(2);
      median = sumarry[2].toFixed(2);
      Q3 = sumarry[3].toFixed(2);
      max = sumarry[4].toFixed(2);
    }
  } 
  return (
    <tr
      className={`cursor-pointer ${
        theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
      }`}
    >
      <td className="p-4">{props.grades.startDate.substring(0, 10)}</td>
      <td className="p-4">{String(props.grades.section).padStart(3, "0")}</td>
      <td className="p-4 text-center">
        {examMean}
        {asPercents && examGrades.length > 0 ? "%" : ""}
      </td>
      <td className="p-4 text-center">
        {examStdev}
        {asPercents && examGrades.length > 1 ? "%" : ""}
      </td>
      <td className="p-4 text-center">
        {min}
        {asPercents && examGrades.length > 0 ? "%" : ""}
      </td>
      <td className="p-4 text-center">
        {Q1}
        {asPercents && examGrades.length > 0 ? "%" : ""}
      </td>
      <td className="p-4 text-center">
        {median}
        {asPercents && examGrades.length > 0 ? "%" : ""}
      </td>
      <td className="p-4 text-center">
        {Q3}
        {asPercents && examGrades.length > 0 ? "%" : ""}
      </td>
      <td className="p-4 text-center">
        {max}
        {asPercents && examGrades.length > 0 ? "%" : ""}
      </td>
      <td className="p-4 text-center">
        {examGrades.length}
      </td>
    </tr>
  );
}

export default InstructorYearlyTest;
