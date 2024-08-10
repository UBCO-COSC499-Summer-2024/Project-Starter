// app/frontend/src/components/Instructor/StudentSpreadsheet.jsx

import React, { useEffect, useState } from "react";
import { useTheme } from "../../App";
import validateUser from "../../hooks/validateUser";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../hooks/getUserInfo";
import ScanView from "./ScanView";
import ParseStudentGrades from "./ParseStudentGrades.jsx";
import getGrades from '../../hooks/getGrades';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faPercent } from '@fortawesome/free-solid-svg-icons'; // Import specific icon

let courseName = "";

function StudentSpreadsheet(props) {
  const navigate = useNavigate();
  const [gradeList, setGradeList] = useState(null);
  const [scanViewInfo, setScanViewInfo] = useState({
    isOpen: false,
    student: 0,
    exam: 0,
    examName: "",
    score: 0,
    course: 0,
    courseName: "",
    firstName: "",
    lastName: "",
    isRegistered: false,
  });
  //const [asPercents, setAsPercents] = useState(true); // Added state for percentages
  courseName = props.courseName;
  //Stores information for the instructor which is currently signed in.
  const [userInfo, setUserInfo] = useState({
    name: "",
    id: 0,
  });
  const { theme } = useTheme();

  useEffect(() => {
    const checkSession = async () => {
      const session = await validateUser();
      if (!session) {
        navigate("/login");
      } else {
        const info = await getUserInfo();
        setUserInfo({
          name: info.name,
          id: info.userId,
        });
        //Queries the database to obtain the grades and exams for the course specified by courseId
        if (!gradeList) {
          setGradeList(await getGrades(props.courseId));
        }
      }
    };

    checkSession();
  }, [navigate, gradeList]);

  const parsedGrades = gradeList ? ParseStudentGrades(gradeList) : null;
  const grades = parsedGrades ? parsedGrades.grades : null;
  const exams = parsedGrades ? parsedGrades.exams : null;

  const onClose = async () => {
    setScanViewInfo({
      isOpen: false,
      student: 0,
      exam: 0,
      examName: "",
      score: 0,
      course: 0,
      courseName: "",
      isRegistered: false,
    });
    setGradeList(await getGrades(props.courseId));
  };

  return (
    <>
      <table className="overflow-x-scroll">
        <thead>{createHeaders(exams, theme)}</thead>
        <tbody>
          {createRows(
            grades,
            theme,
            props.courseId,
            scanViewInfo,
            setScanViewInfo,
            props.asPercents,
          )}
        </tbody>
      </table>
      <ScanView
        scanViewInfo={scanViewInfo}
        onClose={onClose}
        courseName={props.courseName}
        setScanViewInfo={setScanViewInfo}
      />
      <p className="mt-[5px]">Course ID: {props.courseId}</p>
      <p className="mt-[5px]">Instructor name: {userInfo.name}</p>
      <p className="mt-[5px]">Instructor ID: {userInfo.id}</p>
    </>
  );
}

/* Creates the header row for the spreadsheet. By using exams as an argument, it is able
to create columns dynamically. Columns are only created for exams which have been marked.*/
function createHeaders(exams, theme) {
  if (exams) {
    const examColumns = exams.map((exam) => {
      if(exam.examName && exam.examId) {
      return (
        <th
          key={exam.examId}
          className={`p-4 ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          {exam.examName.length < 24 ? exam.examName : exam.examName.substring(0, 21) + "..."}
        </th>
      );
    }
    });
    return (
      <>
        <tr key="Header">
          <th
            key="StudentId"
            className={`p-4 text-left ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Student ID
          </th>
          <th
            key="Last Name"
            className={`p-4 text-left ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Last Name
          </th>
          <th
            key="First Name"
            className={`p-4 text-left ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            First Name
          </th>
          {examColumns}
        </tr>
      </>
    );
  } else {
    return null;
  }
}

/* Creates a row for each student appearing in grades. This is accomplished by 
iterating through grades and caling a helper function for each student. 
Students who have been registered, but not written any exams, will still be included.
Students who have not registered, but have written tests will also appear. */
function createRows(grades, theme, course, scanViewInfo, setScanViewInfo, asPercents) {
  if (grades) {
    let rows = [];
    for (let i = 0; i < grades.length; i++) {
      rows.push(
        createSingleRow(grades[i], theme, course, scanViewInfo, setScanViewInfo, asPercents)
      );
    }
    return rows;
  } else {
    return null;
  }
}

/*Creates a row for a single user. Each cell in the row is clickable and currently 
logs the userID, examId, and score for the cell clicked. This will later be modifed
to display a modal view containing the scan cooresponding to the cell, and allowing the 
instructor to edit the responses stored by the system.*/
function createSingleRow(
  studentGrades,
  theme,
  course,
  scanViewInfo,
  setScanViewInfo,
  asPercents
) {
  if (studentGrades) {
    const handleClick = (
      userId,
      examId,
      studentScore,
      courseId,
      firstName,
      lastName,
      examName
    ) => {
      setScanViewInfo({
        isOpen: true,
        student: userId,
        exam: examId,
        examName: examName,
        score: studentScore,
        course: courseId,
        firstName: firstName,
        lastName: lastName,
        courseName: courseName,
        isRegistered: studentGrades.isRegistered,
      });
    };
    const studentGradeList = studentGrades.scores.map((grade) => {
      return (
        <td
          key={grade.examId}
          onClick={() =>
            handleClick(
              studentGrades.userId,
              grade.examId,
              grade.studentScore,
              course,
              studentGrades.firstName,
              studentGrades.lastName,
              grade.examName
            )
          }
          className="p-4 hover:bg-black/10 cursor-pointer text-center"
        >
          {asPercents ? ( grade.studentScore !== '-' ? `${(100 * grade.studentScore / grade.maxScore).toFixed(2)}%` : '-') : grade.studentScore}
        </td>
      );
    });

    let colors = "";
    if (theme === "dark") {
      if (studentGrades.isRegistered) {
        colors = "bg-gray-700 text-white";
      } else {
        colors = "bg-[rgba(80,_50,_50,_1.0)] text-[white]";
      }
    } else {
      if (studentGrades.isRegistered) {
        colors = "bg-gray-200 text-black";
      } else {
        colors = "bg-[rgba(250,_150,_150,_1.0)] text-[black]";
      }
    }
    //Add border? border-[1px] border-[solid] border-[black]
    return (
      <tr key={studentGrades.userId} className={`rounded-lg ${colors}`}>
        <td key={studentGrades.userId} className="p-4">
          {String(studentGrades.userId).padStart(8, "0")}
        </td>
        <td key={studentGrades.lastName} className="p-4">
          {studentGrades.lastName}
        </td>
        <td key={studentGrades.firstName} className="p-4">
          {studentGrades.firstName}
        </td>
        {studentGradeList}
      </tr>
    );
  } else {
    return null;
  }
}

export default StudentSpreadsheet;
