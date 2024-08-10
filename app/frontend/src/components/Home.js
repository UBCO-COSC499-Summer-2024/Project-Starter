import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App'; // Ensure this path is correct

function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className={`h-full content-center ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-col gap-16">
        <img src="/gradeit.svg" alt="Logo" className="w-2/5 flex self-center mb-12" />
        <h1 className='flex self-center'>You are viewing the home page</h1>
      </div>
    </div>
  );
}

export default Home;
