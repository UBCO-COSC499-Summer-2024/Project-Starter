
function computeSingleGrade(questions) {
    let studentScore = 0;
    let maxScore = 0;
    for(let i = 0; i < questions.length; i++) {
        if(ArraysContainSameElements(questions[i].response, questions[i].correct_answer)) {
            studentScore += questions[i].weight;
        }
        maxScore += questions[i].weight;
    }
    return {
        studentScore: studentScore,
        maxScore: maxScore
    }
}

function ArraysContainSameElements(arr1, arr2) {
    arr1.sort();
    arr2.sort();
    if (arr1.length === arr2.length) {
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

export default computeSingleGrade;
