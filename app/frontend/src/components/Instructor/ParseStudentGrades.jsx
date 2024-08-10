//Main for parsing the backend query which returns the data nessecary for cells in the spreadSheet component.
function ParseStudentGrades(grades) {
  if (grades && grades.length > 0) {
    let exams = getExams(grades);
    let appendedGrades = [];
    appendedGrades.push(appendSingleGrade(grades, exams, 0));
    for (let i = 1; i < grades.length; i++) {
      /*call the function appendSingleGrade ONLY when a new student has been detected in grades. 
            The appendedGrades should contain a list of unique students registered in the course, with their grades appended.
            Each student should only appear once in this array.*/
      if (grades[i].userId !== grades[i - 1].userId) {
        appendedGrades.push(appendSingleGrade(grades, exams, i));
      }
    }
    return {
      grades: appendedGrades,
      exams: exams,
    };
  } else {
    return null;
  }
}

/*Scan the query for the different exams which have been marked. 
Store each unique examID/examName pair exactly once.*/
function getExams(grades) {
  let distinctExams = [];
  //helper function to see if our array of distinct exams already contains an exam or not.
  const containsExamId = (examId, examArray) => {
    for (let i = 0; i < examArray.length; i++) {
      if (examId == examArray[i].examId) {
        return true;
      }
    }
    return false;
  };
  for (let i = 0; i < grades.length; i++) {
    let examInfo = {
      examId: grades[i].examId,
      examName: grades[i].examName,
    };
    //The examID -1 is only used to identify/flag students who are registered, but didn't complete any tests.
    //It does not coorespond to any exams, so we shouldn't push it to out examlist.
    if (
      examInfo.examId !== -1 &&
      !containsExamId(examInfo.examId, distinctExams)
    ) {
      distinctExams.push(examInfo);
    }
  }
  return distinctExams;
}

/* creates an object for the specified yser containing their information
and an array of their locate all of their scores on different exams 
for the course which the grades parameter relates to. 
The scores array stores the examId and associated score as an object,*/
function appendSingleGrade(grades, exams, user) {
  let singleUserGrades = {
    userId: grades[user].userId,
    firstName: grades[user].firstName,
    lastName: grades[user].lastName,
    isRegistered: grades[user].isRegistered,
    scores: [],
  };
  //iterate through the distinct exams to see if this user has completed the exam,
  //and push the associated grade to scores.
  if (exams.length > 0) {
    //Students who did not complete any exams will have be identified by having an element in grades with examId -1.
    //Their grades should be padded with zero's
    if (grades[user].examId === -1) {
      for (let i = 0; i < exams.length; i++) {
        singleUserGrades.scores.push({
          examId: exams[i].examId,
          examName: exams[i].examName,
          studentScore: `-`,
          maxScore: 1,
        });
      }
    } else {
      let examsIdx = 0;
      //ensure that scores does not store the grades for a different student
      let newStudent = false;
      let userIdx = user;
      while (examsIdx < exams.length && !newStudent) {
        //Find matching examId's and push the grade to scores.
        if (exams[examsIdx].examId === grades[userIdx].examId) {
          singleUserGrades.scores.push({
            examId: grades[userIdx].examId,
            examName: grades[userIdx].examName,
            studentScore: grades[userIdx].studentScore,
            maxScore: grades[userIdx].maxScore,
          });
          userIdx++;
          examsIdx++;
        } else {
          //If no match was found, the student did not write the test, and should be awarded a grade of zero.
          singleUserGrades.scores.push({
            examId: exams[examsIdx].examId,
            examName: exams[examsIdx].examName,
            studentScore: `-`,
            maxScore: 1,
          });
          examsIdx++;
        }
        if (grades[userIdx]) {
          //update newStudent by comparing the userID at userIdx to the orinal userID which passed to this
          //function in the user arguments.
          newStudent = grades[userIdx].userId !== grades[user].userId;
        } else {
          break;
        }
      }
      //If a newStudent was detected before completing iteration through the exam list, then the student
      //didn't write the remaining exams and should recieve a score of zero for each one.
      for (examsIdx; examsIdx < exams.length; examsIdx++) {
        singleUserGrades.scores.push({
          examId: exams[examsIdx].examId,
          examName: exams[examsIdx].examName,
          studentScore: `-`,
          maxScore: 1
        });
      }
    }
  }
  return singleUserGrades;
}

export default ParseStudentGrades;
