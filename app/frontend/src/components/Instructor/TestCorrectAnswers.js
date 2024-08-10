import React, { useState, useEffect } from 'react';
import { useTheme } from '../../App';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EditBubble from '../BubbleSheet/EditableBubbles';
import Answer from '../Modules/TestAnswer';

const TestCorrectAnswers = (props) => {
  const userId = props.id;
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state || {};
  const { courseId, testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answerKeyUploaded, setAnswerKeyUploaded] = useState(1);
  const [fileUploaded, setFileUploaded] = useState(1);
  const [numQuestions, setNumQuestions] = useState(100);
  const [showingScan, setShowingScan] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [answerKeyProgress, setAnswerKeyProgress] = useState(0);
  const [fileProgress, setFileProgress] = useState(0);

  useEffect(() => {
    fetchData();
  }, [testId]);

  const fetchData = async () => {
    const data = await fetch(`http://localhost/api/questions/answers/${testId}`);
    const results = await data.json();
    setQuestions(results);
    setLoading(false);
  };

  const handleFileUpload = async (event) => {
    setFileUploaded(2);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await fetch('http://localhost/api/tests/upload/responses', {
        method: 'POST',
        body: formData,
        headers: {
          'testid': test.id,
          'numquestions': numQuestions,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFileProgress(percentCompleted);
        }
      });
      setFileUploaded(3);
      setFileProgress(0);
      setTimeout(fetchData, 500);
    }
  };

  const handleAnswerKeyUpload = async (event) => {
    setAnswerKeyUploaded(2);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://localhost/api/tests/upload/answers', {
        method: 'POST',
        body: formData,
        headers: {
          'testid': test.id,
          'numquestions': numQuestions,
          'userid': userId,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setAnswerKeyProgress(percentCompleted);
        }
      });
      const data = await response.json();
      test.correctAnswers = data.correctAnswers;
      setAnswerKeyUploaded(3);
      setAnswerKeyProgress(0);
      setTimeout(fetchData, 500);
    }
  };

  const fetchImageUrl = async (examId, userId) => {
    const response = await fetch(`http://localhost/api/users/scans/${examId}/${userId}`);
    const data = await response.json();
    return data.path;
  };

  const displayImage = (path) => {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';
    const imgElement = document.createElement('img');
    imgElement.src = 'http://localhost' + path;
    imgElement.alt = 'Scan Image';
    imgElement.className = 'rounded-lg';
    imageContainer.appendChild(imgElement);
  };

  const handleScanClick = () => {
    setShowingScan(true);
    fetchImageUrl(test.id, props.id).then((path) => displayImage(path));
  };

  const handleScanClose = () => {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';
    setShowingScan(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredQuestions = questions.filter((question) =>
    question.question_num.toString().includes(searchQuery)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <button
        onClick={() => navigate(-1)}
        className={`px-4 py-2 rounded transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-gray-300 text-black hover:bg-blue-400'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7M21 12H3" />
        </svg>
        Back
      </button>
      <div className="flex-grow">
        <div className={`rounded-lg p-6 shadow-lg mb-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-2xl font-bold mb-4">{test?.name} - Correct Answers</h2>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="100q" className="mr-2">100 Questions</label>
                <input type="radio" id="100q" name="numquestions" defaultChecked onClick={() => setNumQuestions(100)} />
              </div>
              <div>
                <label htmlFor="200q" className="mr-2">200 Questions</label>
                <input type="radio" id="200q" name="numquestions" onClick={() => setNumQuestions(200)} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="answerKeyUpload" className="block text-sm font-medium mb-2">Upload Answer Key</label>
                <input
                  id="answerKeyUpload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleAnswerKeyUpload}
                  className={`block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:cursor-pointer
                    ${theme === 'dark' ? 'file:bg-gray-700 file:text-white' : 'file:bg-gray-300 file:text-black'}
                  `}
                />
                {answerKeyUploaded === 2 && (
                  <>
                    <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                      File upload in progress!
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${answerKeyProgress}%` }}></div>
                    </div>
                  </>
                )}
              </div>
              <div>
                <label htmlFor="studentTestUpload" className="block text-sm font-medium mb-2">Upload Student Tests</label>
                <input
                  id="studentTestUpload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className={`block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:cursor-pointer
                    ${theme === 'dark' ? 'file:bg-gray-700 file:text-white' : 'file:bg-gray-300 file:text-black'}
                  `}
                />
                {fileUploaded === 2 && (
                  <>
                    <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                      File upload in progress!
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${fileProgress}%` }}></div>
                    </div>
                  </>
                )}
                {fileUploaded === 3 && (
                  <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                    Student tests uploaded successfully!
                  </p>
                )}
              </div>
            </div>
            <div>
              {!showingScan && <button
                onClick={handleScanClick}
                className={`px-4 py-2 rounded transition duration-200 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
              >
                Show Answer sheet Scan
              </button>}
              {showingScan && <button
                onClick={handleScanClose}
                className={`px-4 py-2 rounded transition duration-200 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
              >
                Close Scan
              </button>}
            </div>
          </div>
        </div>
        <div className={`rounded-lg shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <input
            type="text"
            placeholder="Search by question #"
            value={searchQuery}
            onChange={handleSearchChange}
            className={`mb-4 p-2 rounded border ${theme === 'dark' ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-gray-100 text-black'}`}
          />
          {!showingScan && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Question Number</th>
                  <th className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Correct Answer</th>
                  <th className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Weight</th>
                  <th className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Functions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuestions.map((question, index) => (
                  <Answer question={question} key={index} fetchData={fetchData}/>
                ))}
              </tbody>
            </table>
          )}
          <div id='imageContainer' className='mt-4'></div>
        </div>
      </div>
    </div>
  );
};

export default TestCorrectAnswers;
