// app/frontend/src/components/Modules/ExamModule.js

import React from 'react';
import Bubble from '../BubbleSheet/Bubbles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

const Exam = (props) => {
    const { question, theme, handleFlagClick, examKey } = props;

    const arraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) return false;
        }
        return true;
      };

    return (
        <tr key={examKey} className="cursor-pointer">
            <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.question_num}</td>
            <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.num_options}</td>
            <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{question.weight}</td>
            <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>
                <Bubble question={question} theme={theme} />
            </td>
            <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>{arraysEqual(question.correct_answer, question.response) ? question.weight : 0}</td>
            <td className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white justify-center' : 'bg-gray-300 text-black justify-center'}`}>
                {question.issue ? question.issue : <FontAwesomeIcon icon={faFlag} onClick={() => handleFlagClick(question)} />}
            </td>
        </tr>
    );
}

export default Exam;
