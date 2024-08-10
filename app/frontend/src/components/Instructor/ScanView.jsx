import React, { useEffect, useState } from "react";
import getStudentData from "../../hooks/getStudentData";
import { useTheme } from "../../App";
import validateUser from "../../hooks/validateUser";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../hooks/getUserInfo";
import InstResponseBubbles from "../BubbleSheet/InstResponsesBubble";

function ScanView(props) {
  const scanViewInfo = props.scanViewInfo;
  const [responseData, setResponseData] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [userInfo, setUserInfo] = useState({
    name: "",
    id: 0,
  });

  useEffect(() => {
    const checkSession = async () => {
      const session = await validateUser();
      if (!session) {
        navigate("/login");
      } else {
        const info = await getUserInfo();
        setUserInfo({
          name: info.name,
          id: info.userId,
        });
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const setResponses = async () => {
      setResponseData(
        await getResponses(scanViewInfo.student, scanViewInfo.exam)
      );
    };
    setResponses();
    setLoading(true);
  }, [scanViewInfo]);

  useEffect(() => {
    fetchData();
  }, [scanViewInfo.exam]);

  const fetchData = async () => {
    const data = await fetch(`http://localhost/api/questions/answers/${scanViewInfo.exam}`);
    const results = await data.json();
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
          'testid': scanViewInfo.exam,
          'numquestions': 100 // FOR NOW
        },
      });
      setFileUploaded(3);
      setTimeout(fetchData, 500);
    }
  };

  const registerStudent = async (userId, courseId) => {
    try {
      await fetch(`HTTP://localhost/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
        },
        body: JSON.stringify({
          courseId: courseId,
          studentId: userId,
        }),
      });
    } catch {
      console.error(
        `Error registering user: ${userId} in course: ${courseId}`
      );
    }
    props.onClose();
  };

  const deleteResponses = async (userId, examId) => {
    try {
      await fetch(`HTTP://localhost/api/responses/delete`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
        },
        body: JSON.stringify({
          userId: userId,
          examId: examId
        }),
      });
    } catch {
      console.error(
        `Error deleting responses for user: ${userId} on exam: ${examId}`
      );
    }
    props.onClose();
  };

  if (scanViewInfo.isOpen && responseData && responseData.length > 0) {
    fetchImageUrl(scanViewInfo.exam, scanViewInfo.student).then(path => displayImage(path));

    return (
      <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <div className={`fixed top-5 left-5 w-11/12 h-5/6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
          <button onClick={props.onClose} className={`float-right mx-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Close
          </button>
          <div className="flex space-x-2 flex-right">
            <h3 className={`mx-5 my-1 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Editing grades for {scanViewInfo.firstName} {scanViewInfo.lastName} on {scanViewInfo.examName}
            </h3>
          </div>
          <div className={`${theme === 'dark' ? 'text-yellow-400' : 'text-red-400'}`}>
            {!scanViewInfo.isRegistered ? (
              <>
                <h3>Warning: {scanViewInfo.firstName} {scanViewInfo.lastName} is not registered in {scanViewInfo.courseName}, yet has responses recorded for this course.</h3>
                <div className="flex space-x-24 mx-12">
                  <button className={`hover:text-red-500 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`} onClick={() => registerStudent(scanViewInfo.student, scanViewInfo.course)}>Register student</button>
                  <button className={`hover:text-red-500 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`} onClick={() => deleteResponses(scanViewInfo.student, scanViewInfo.exam)}>Delete responses</button>
                </div>
              </>
            ) : null}
          </div>
          <InstResponseBubbles
            responseData={responseData}
            student={scanViewInfo.student}
            exam={scanViewInfo.exam}
            setScanViewInfo={props.setScanViewInfo}
            onClose={props.onClose}
          />
          <div id='imageContainer' className='mt-4 w-1/2 mx-12 h-3/4 overflow-auto rounded-lg'>
          </div>
        </div>
      </div>
    );
  } else if (scanViewInfo.isOpen && scanViewInfo.student !== "undefined") {
    return (
      <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <div className={`fixed top-5 left-5 w-11/12 h-5/6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
          <button onClick={props.onClose} className={`float-right mx-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Close
          </button>
          <p>No Responses!</p>
          <div className="flex items-center">
            <label className="block text-sm font-medium mb-2 mr-4">Upload Student Tests</label>
            {fileUploaded === 3 ? (
              <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                Student tests uploaded successfully!
              </p>
            ) : (
              <input
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
            )}
            {fileUploaded === 2 && (
              <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                File upload in progress!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const getResponses = async (userId, examId) => {
  const response = await fetch(
    `HTTP://localhost/api/questions/responses/${examId}&${userId}`
  );
  if (response.ok) {
    const selectedResponses = await response.json();
    return selectedResponses;
  } else {
    console.log(
      `Error retrieving responses for user: ${userId} on exam: ${examId}`
    );
    return null;
  }
};

export default ScanView;
