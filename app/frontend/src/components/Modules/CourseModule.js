import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from '../../App';
import { fiveNumSummary, mean, stdev, } from "../Instructor/stats.jsx";
import { useNavigate } from 'react-router-dom';
import computeSingleGrade from "../computeSingleGrade.js";
import getQuestions from "../../hooks/getQuestions.js";

const StudentTest = ({ test, parsedGrades, asPercents, studentId }) => {

    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const { theme } = useTheme();
    const fetchData = useCallback(async () => {
      const data = await getQuestions(test.id, studentId);
      console.log('Total questions fetched:', data.length);
      setQuestions(data);
    }, [studentId]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    let scores;
    let color = "";
    if(questions) {
        scores = computeSingleGrade(questions);
        let gradeCategory = Math.ceil(10*scores.studentScore/scores.maxScore + 0.00001);
        if(scores.maxScore !== 0) {
        switch (gradeCategory) {
            case 11: color = "text-[rgba(86,195,164,1.0)]"; break;
            case 10: color = "text-[rgba(86,195,164,1.0)]"; break;
            case 9: color = "text-[rgba(116,155,191,1.0)]"; break;
            case 8: color = "text-[rgba(128,181,76,1.0)]"; break;
            case 7: color = "text-[rgba(247,198,70,1.0)]"; break;
            case 6: color = "text-[rgba(244,163,88,1.0)]"; break;
            default: color = "text-[rgba(237,62,51,1.0)]"; break;
        }
      }
    }

    console.log("Parsed Grades:", parsedGrades)
    let examMean = "-";
    let examStdev = "-";
    let [min, Q1, median, Q3, max] = ["-","-","-","-","-"];
    let examGrades = [];
    if (parsedGrades) {
    for(let i = 0; i < parsedGrades.grades.length; i ++) {
      for(let j = 0; j < parsedGrades.grades[i].scores.length; j++)
        if(parsedGrades.grades[i].scores[j].examId === test.id && parsedGrades.grades[i].scores[j].studentScore !== `-`) {
          if(!asPercents) {
            examGrades.push(parsedGrades.grades[i].scores[j].studentScore/1.0);
          } else {
            examGrades.push(100*parsedGrades.grades[i].scores[j].studentScore/parsedGrades.grades[i].scores[j].maxScore);
          }
          break;
        }
    }
    examMean = examGrades.length > 0 ? mean(examGrades).toFixed(2) : '-';
    examStdev = examGrades.length > 0 ? stdev(examGrades).toFixed(2) : '-';
    if(examGrades.length > 0) {
      let sumarry =  fiveNumSummary(examGrades);
      min = sumarry[0].toFixed(2);
      Q1 = sumarry[1].toFixed(2);
      median = sumarry[2].toFixed(2);
      Q3 = sumarry[3].toFixed(2);
      max = sumarry[4].toFixed(2);
    }
  }
    return(
        <tr
          className={`cursor-pointer ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
          onClick={() => navigate(`/student/exam/${test.id}`)}
        >
          <td className="p-4">{test.name.length < 32 ? test.name : test.name.substring(0, 29) + "..."}</td>
          <td className={`p-4 ${color}`}>{scores.maxScore === 0 ? '-' : `${scores.studentScore}/${scores.maxScore}`}</td>
          <td className="p-4 text-center">{examMean}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{examStdev}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{min}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{Q1}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{median}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{Q3}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
          <td className="p-4 text-center">{max}{asPercents&&examGrades.length > 0 ? '%' :''}</td>
        </tr>
    )
}

export default StudentTest;