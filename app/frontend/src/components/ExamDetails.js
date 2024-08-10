import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../App'; // Assuming useTheme is available at this path
import getQuestions from '../hooks/getQuestions';
import Modal from './issueModal'; // Ensure this path is correct
import Exam from './Modules/ExamModule';
import computeSingleGrade from './computeSingleGrade';

const ExamDetails = (props) => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [issue, setIssue] = useState('');

    const fetchData = useCallback(async () => {
        const data = await getQuestions(examId, props.id);
        console.log('Total questions fetched:', data.length);
        setQuestions(data);
        setLoading(false);
    }, [examId, props.id]);

    useEffect(() => {
        fetchData();
    }, [examId, fetchData]);

    useEffect(() => {
        fetchImageUrl(examId, props.id).then((path) => displayImage(path));
    }, [loading]);

    const handleFlagClick = (question) => {
        setSelectedQuestion(question);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIssue('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost/api/flags/set', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                examId,
                userId: props.id,
                questionNum: selectedQuestion.question_num,
                flagText: issue,
            }),
        });

        handleCloseModal();
    };

    const fetchImageUrl = async (examId, userId) => {
        const response = await fetch(`http://localhost/api/users/scans/${examId}/${userId}`);
        const data = await response.json();
        console.log(data.path);
        return data.path;
      };
    
      const displayImage = (path) => {
        const imageContainer = document.getElementById('imageContainer');
        if(imageContainer) {
            imageContainer.innerHTML = '';
            const imgElement = document.createElement('img');
            imgElement.src = 'http://localhost' + path;
            imgElement.alt = 'Scan Image';
            imgElement.className = 'rounded-lg';
            console.log('Displaying image from:' + imgElement.src);
            imageContainer.appendChild(imgElement);
        }
      };

    if (loading) {
        return <div>Loading...</div>;
    }
    
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

    return (
        <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <h1 className="text-3xl font-bold mb-4">Exam Details</h1>
            <h1 className={`text-3xl font-bold mb-4 ${color}`}>{scores.maxScore !== 0 ? `Your Score ${scores.studentScore}/${scores.maxScore}` : ``}</h1>
            <button
                onClick={() => navigate(-1)} // Navigate back to the previous page
                className={`w-full px-4 py-2 rounded transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-gray-300 text-black hover:bg-blue-400'}`}
            >
                Back
            </button>

            {questions.length === 0 ? (
                <div className="text-center text-xl text-red-500">This Exam has not been checked by the instructor</div>
            ) : (
                <div className="flex-grow overflow-x-auto">
                    <div id="imageContainer"></div>
                    <table className="w-full min-w-[800px] text-left border-separate" style={{ borderSpacing: '0 10px' }}>
                        <thead>
                            <tr>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Question</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Number of Options</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Weight</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Correct Answers</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Grade</th>
                                <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Issues</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question, index) => (
                                <Exam question={question} examKey={index} theme={theme} handleFlagClick={handleFlagClick} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal 
                show={showModal} 
                handleClose={handleCloseModal} 
                handleSubmit={handleSubmit} 
                issue={issue} 
                setIssue={setIssue} 
            />
        </div>
    );
};

export default ExamDetails;
