const updateAnswer = async (id, updatedAnswer) => {
    try {
        const correctAnswers = [];
        for(let i = 0; i < updatedAnswer.length; i++) {
            if(updatedAnswer[i] === 'green') {
                correctAnswers.push(i);
            }
        }
      const response = await fetch(`http://localhost/api/questions/edit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correct_answer: correctAnswers })
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error updating answer:', error);
    }
};

export default updateAnswer