import React, { useState, useEffect } from 'react';

const Bubble = (props) => {
    const [response, setResponse] = useState(props.question.response);
    const [answers, setAnswers] = useState(props.question.correct_answer);
    const [compared, setCompared] = useState(Array(props.question.num_options).fill(''));

    useEffect(() => {
        const updatedCompared = Array(props.question.num_options).fill('');

        for (let i = 0; i < props.question.num_options; i++) {
            const responseIndex = response.indexOf(i);
            const answerIndex = answers.indexOf(i);

            if (responseIndex !== -1 && answerIndex !== -1) {
                updatedCompared[i] = 'green';
            } else if (responseIndex !== -1 && answerIndex === -1) {
                updatedCompared[i] = 'red';
            } else if (responseIndex === -1 && answerIndex !== -1) {
                updatedCompared[i] = 'yellow';
            }
        }

        setCompared(updatedCompared);
    }, [response, answers, props.question.num_options]);

    const getTitle = (color) => {
        switch (color) {
            case 'green':
                return 'Answer chosen (correct)';
            case 'red':
                return 'Answer chosen (wrong)';
            case 'yellow':
                return 'Correct answer (not chosen)';
            default:
                return '';
        }
    };

    return (
        <div>
            {compared.map((color, index) => (
                <div
                    key={index}
                    className={`w-6 h-6 rounded-full inline-block mx-1 ${color === 'green' ? "bg-green-700" : color === 'red' ? "bg-red-700" : color === 'yellow' ? "bg-yellow-500" : ""}`}
                    style={{
                        borderColor: props.theme === 'dark' ? 'white' : 'black',
                        borderWidth: '0.5px',
                        borderStyle: 'solid'
                    }}
                    title={getTitle(color)}
                >
                    <div className={`text-center text-sm ${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>{String.fromCharCode(65 + index)}</div>
                </div>
            ))}
        </div>
    );
};

export default Bubble;
