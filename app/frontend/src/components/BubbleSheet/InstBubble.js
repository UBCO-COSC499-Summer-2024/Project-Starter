import React from 'react';

const InstBubble = ({ question, onSelect }) => {
  const options = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="flex space-x-2">
      {options.map(option => (
        <div
          key={option}
          className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer ${question.correctAnswer.includes(option) ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
          onClick={() => {
            console.log(`Selected option: ${option}`);
            onSelect(option);
          }}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default InstBubble;
