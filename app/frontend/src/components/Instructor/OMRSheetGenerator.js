// app/frontend/src/components/Instructor/OMRSheetGenerator.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

const OMRSheetGenerator = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const downloadFile = () => {
    const fileUrl = type === '100' ? '/100bubble.pdf' : '/200bubble.pdf';
    saveAs(process.env.PUBLIC_URL + fileUrl, fileUrl.split('/').pop());
  };

  React.useEffect(() => {
    downloadFile();
    const timer = setTimeout(() => {
      navigate(-1); // Navigate back to the previous page
    }, 3000); // 3 seconds delay before redirecting

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [type, navigate]);

  return <div>Your file is downloaded. You will be redirected shortly...</div>;
};

export default OMRSheetGenerator;
