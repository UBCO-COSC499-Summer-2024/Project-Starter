import React, { useState, useEffect } from 'react';
import updateAnswer from '../../hooks/UpdateAnswer';

const EditBubble = (props) => {
  const correctAnswer = props.question.correct_answer;
  const { isEditing } = props
  const [options, setOptions] = useState(Array(props.question.num_options).fill(''));

  useEffect(() => {
    const updatedOptions = Array(props.question.num_options).fill('');
    for (let i = 0; i < props.question.num_options; i++) {
      if (correctAnswer.includes(i)) {
        updatedOptions[i] = 'green';
      }
    }
    setOptions(updatedOptions);
  }, [correctAnswer, props.question.num_options]);

  const handleBubbleClick = (index) => {
    const updatedOptions = [...options];
    if(updatedOptions[index] === 'green') {
        updatedOptions[index] = '';
    } else {
        updatedOptions[index] = 'green';
    }
    setOptions(updatedOptions);
    console.log(updatedOptions);
    updateAnswer(props.question.question_id, updatedOptions);
  };

  return (
    <div>
      {options.map((color, index) => (
        isEditing ? <div
          key={index}
          className={`${color === 'green' ? "bg-green-700" : ""} w-6 h-6 rounded-full border-white border-[0.5px] inline-block mx-1 hover:cursor-pointer`}
          onClick={() => handleBubbleClick(index)}
        >
          <div className='text-center text-sm'>
            {String.fromCharCode(65 + index)}
          </div>
        </div> : <div
          key={index}
          className={`${color === 'green' ? "bg-green-700" : ""} w-6 h-6 rounded-full border-white border-[0.5px] inline-block mx-1 cursor-default`}
        >
          <div className='text-center text-sm'>
            {String.fromCharCode(65 + index)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditBubble;
