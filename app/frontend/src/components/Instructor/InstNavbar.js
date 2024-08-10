// app/frontend/src/components/Instructor/InstNavbar.js

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import getCourseData from '../../hooks/getCourseData';
import validateUser from '../../hooks/validateUser';
import AddCourseModal from './AddCourseModal';
import ProfileMenuModal from '../ProfileMenuModal'; // Ensure the path is correct
import { useTheme } from '../../App'; // Adjust the path as needed
import getUserInfo from '../../hooks/getUserInfo';
import NotificationBell from './NotificationBell';
import Avatar from '../Avatar'; // Import Avatar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import Flip from '../Flip'; // Import the Flip component

const InstNavbar = (props) => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState({ seed: 'initial' });
  const [flippedCourses, setFlippedCourses] = useState({});
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    image: 'https://via.placeholder.com/150',
    role: 2, // Assuming role 2 for Instructor
  });

  useEffect(() => {
    const checkSession = async () => {
      const session = await validateUser();
      if (!session) {
        navigate("/login");
      } else {
        const userInfo = await getUserInfo();
        setUser({
          name: userInfo.name,
          email: userInfo.userEmail,
          image: 'https://via.placeholder.com/150',
          role: userInfo.role,
        });
      }
    };

    checkSession();
  }, [navigate]);

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (props.id) {
        const courseData = await getCourseData(props.id);
        setCourses(courseData);
      }
    };
    fetchData();
  }, [props.id]);

  const getRoleName = (role) => {
    switch (role) {
      case 1:
        return 'Student';
      case 2:
        return 'Instructor';
      default:
        return 'Unknown Role';
    }
  };

  const handleFlipClick = (courseId) => {
    setFlippedCourses(prevState => ({
      ...prevState,
      [courseId]: !prevState[courseId]
    }));
  };

  const handleSaveCourse = (courseId, updatedCourse) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.course_id === courseId ? { ...course, ...updatedCourse } : course
      )
    );
  };

  const handleCardClick = (courseId) => {
    if (!flippedCourses[courseId]) {
      setSelectedCourseId(courseId); // Set selected course ID
      navigate(`/instructor/course/${courseId}`);
    }
  };

  const handleAddCourse = async (data) => {
    const department = data.courseDept;
    const code = data.courseCode;
    const section = data.courseSection; 
    const description = data.description;
    const startDate = data.startDate;
    const endDate = data.endDate;
    const newCourse = { department, code, section, description, start_date: startDate, end_date: endDate, user_id: props.id };
    console.log("New Course:",newCourse)

    try {
      const response = await fetch('http://localhost/api/courses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });
      if (response.ok) {
        const addedCourse = await response.json();
        setCourses([...courses, addedCourse]);
      } else {
        console.error('Error adding course:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const containerStyle = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black';
  const headerStyle = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-300';
  const linkActiveStyle = theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-400 text-black';
  const linkInactiveStyle = theme === 'dark' ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-black hover:bg-gray-400 hover:text-black';
  const cardStyle = theme === 'dark' ? 'text-white' : 'text-black';
  const iconStyle = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`h-full w-64 ${containerStyle} flex flex-col fixed overflow-hidden`}>
      <div className={`pb-2 ${headerStyle} pt-8`}>
        <img src={`${process.env.PUBLIC_URL}/gradeit.svg`} alt="Logo" className="w-48 mx-auto" />
      </div>
      <div className={`my-4 flex justify-evenly ${headerStyle} sticky top-0`}>
        <h2 className={`ml-4 text-lg font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Courses</h2>
        <li
          className={`relative align-middle flex px-8 mr-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-600' : 'bg-gray-300 text-black hover:bg-gray-400'} font-bold text-center cursor-pointer`}
          onClick={() => setIsModalOpen(true)}
          onMouseOver={(e) => {
            const tooltip = e.currentTarget.querySelector('.tooltip');
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
          }}
          onMouseOut={(e) => {
            const tooltip = e.currentTarget.querySelector('.tooltip');
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
          }}
        >
          <span className="align-middle inline-block">+</span>
          <span className="tooltip absolute bg-gray-700 text-white text-xs rounded py-1 px-2 top-full left-1/2 transform -translate-x-1/2 mt-2">Add Course</span>
        </li>
      </div>
      <div className="flex h-[0.5px] taperedline mx-4"></div>
      <div className="flex-grow overflow-y-auto">
        <ul className="mt-4 space-y-4">
          {courses.map((course) => (
            <li key={course.course_id} className="relative">
              <div
                className={`relative mb-4 mx-4 rounded-lg ${cardStyle} shadow-md cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-300'} ${selectedCourseId === course.course_id ? theme === 'dark' ? `bg-gray-800` : `bg-gray-300` : ''}`}
                onClick={() => handleCardClick(course.course_id)}
              >
                <Flip
                  course={course}
                  flipped={flippedCourses[course.course_id] || false}
                  onFlip={handleFlipClick}
                  onSave={handleSaveCourse}
                />
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className={`absolute top-4 right-4 cursor-pointer ${iconStyle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipClick(course.course_id);
                  }}
                />
              </div>
              <div className="flex h-[0.5px] taperedline"></div>
            </li>
          ))}
        </ul>
      </div>
      <div className={`p-4 ${headerStyle}`}>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? `block py-2 px-4 mb-2 rounded-lg ${linkActiveStyle} font-bold`
              : `block py-2 px-4 mb-2 rounded-lg ${linkInactiveStyle}`
          }
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? `block py-2 px-4 mb-2 rounded-lg ${linkActiveStyle} font-bold`
              : `block py-2 px-4 mb-2 rounded-lg ${linkInactiveStyle}`
          }
        >
          Contact
        </NavLink>
        <button
          onClick={() => setIsProfileMenuOpen(true)}
          className={`flex items-center mb-4 cursor-pointer p-2 rounded-lg w-full ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
        >
          <Avatar options={avatarOptions} size={32} /> {/* Use Avatar component */}
          <div className="ml-2 flex-grow">
            <p className="text-sm font-bold">{user.name}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{getRoleName(user.role)}</p>
          </div>
        </button>
        <ProfileMenuModal
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
          user={user}
          onLogout={Logout}
          onAvatarSelect={setAvatarOptions}
        />
      </div>
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </div>
  );
};

export default InstNavbar;
