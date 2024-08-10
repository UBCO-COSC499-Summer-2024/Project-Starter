import React, { useState } from 'react';
import InstBubble from '../BubbleSheet/InstBubble';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../App';

const AddTestModal = ({ isOpen, onClose, courseId, onAddTest }) => {
  const [questions, setQuestions] = useState([]);
  const [examName, setExamName] = useState('');
  const [visibility, setVisibility] = useState(true);
  const { theme } = useTheme();

  const handleAddQuestion = () => {
    setQuestions([...questions, { correctAnswer: [] }]);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleAnswerSelection = (questionIndex, answer) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === questionIndex) {
        const correctAnswer = q.correctAnswer.includes(answer)
          ? q.correctAnswer.filter(a => a !== answer)
          : [...q.correctAnswer, answer];
        console.log(`Question ${questionIndex + 1}: Selected answer ${answer}, Correct answers: ${correctAnswer}`);
        return { ...q, correctAnswer };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleSaveTest = async () => {
    const letterMap = {
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
      'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18,
      'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
  }
    console.log(questions)
    const newTest = {
      name: examName,
      questions: questions.map(q => ({
        ...q,
        correctAnswer: q.correctAnswer.map(a => letterMap[a]), // Ensure correctAnswer is an array of integers
      })),
      courseId,
      visibility
    };
    console.log((visibility ? "Course can be seen" : "Course cannot be seen"))
    console.log("New Test Questions:", newTest.questions)
    console.log("New Test:", newTest);

    try {
      const response = await fetch('http://localhost/api/tests/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newTest),
      });

      if (response.ok) {
        const addedTest = await response.json();
        console.log('Added Test:', addedTest);
        onAddTest(addedTest);
      } else {
        console.error('Error adding test:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding test:', error);
    } finally {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-6 w-full max-w-sm shadow-lg relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl font-bold mb-4">Add New Test</h2>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Exam Name</label>
          <input
            type="text"
            placeholder="Enter exam name"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-200 text-black border-gray-300'}`}
          />
        </div>
        <div>
          <label htmlFor="visibility" className="mr-2">Allow Students To View Answers?</label>
          <input type="checkbox" id="visibility" name="visibility" defaultChecked onClick={() => setVisibility(value => !value)} />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTest}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Save Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTestModal;
