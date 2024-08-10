import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import validateUser from '../../hooks/validateUser';
import ProfileMenuModal from '../../components/Instructor/ProfileMenuModal'; // Ensure the path is correct
import { useTheme } from '../../App'; // Adjust the path as needed
import getUserInfo from '../../hooks/getUserInfo';
import UserManagementModal from './UserManagementModal';
import { Button } from 'antd';



const AdminNavbar = (props) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    image: 'https://via.placeholder.com/150', // Replace with actual user image URL
  });

  useEffect(() => {
    const checkSession = async () => {
      const session = await validateUser();
      if (!session) {
        navigate("/login");
      } else {
        const userInfo = await getUserInfo();
        console.log(userInfo);
        setUser({
          name: userInfo.name,
          email: userInfo.userEmail,
          image: 'https://via.placeholder.com/150',
        });
      }
    };

    checkSession();
  }, [navigate]);

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  
 

  

  return (
    <div className={`h-full w-64 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} flex flex-col justify-between fixed overflow-scroll`}>
      <div>
        <nav>
          <div className={`pb-2 sticky top-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-300'} pt-8`}>
            <img src={`${process.env.PUBLIC_URL}/gradeit.svg`} alt="Logo" className="w-48 mx-auto" />

            <div className="flex flex-col items-center font-bold mt-8">
            <Button onClick={() => navigate('admin/dashboard')}
          className={`flex items-center mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} manage-users-btn`}
          >
            Home
            </Button>
          </div>
           

          </div>
          
          <h1 className="text-center mb-4 mt-4">
            Admin Features 
          </h1>
          <div className="flex flex-col items-center font-bold mt-8">
          <Button 
          onClick={() => navigate('admin/user')}
          className={`flex items-center mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} manage-users-btn`}
          >
            
          Manage Users
        </Button>
        <Button
          onClick={() => navigate('admin/recentchanges')}
          className={`flex items-center mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} manage-users-btn`}
          >
            
          Recent Changes 
        </Button>
        <Button
          onClick={() => navigate('admin/sitestatistics')}
          className={`flex items-center mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} manage-users-btn`}
          >
          
          Admin Statistics
        </Button>
        </div>
        </nav>
      </div>
      <div className={`flex flex-col p-4 sticky bottom-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-300'}`}>
        
   
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? `block py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-400 text-black'} font-bold`
              : `block py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-black hover:bg-gray-400 hover:text-black'}`
          }
          
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? `block py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-400 text-black'} font-bold`
              : `block py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-black hover:bg-gray-400 hover:text-black'}`
          }
        >
          Contact
        </NavLink>
        
        <button
          onClick={() => setIsProfileMenuOpen(true)}
          className={`flex items-center mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
        >
          <img src={user.image} alt="User" className="w-10 h-10 rounded-full mr-4" />
          <div>
            <p className="text-sm font-bold">{user.name}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
          </div>
        </button>
        <ProfileMenuModal
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
          user={user}
          onLogout={Logout}
        />
        <UserManagementModal
          isOpen={isUserManagementOpen}
          onClose={() => setIsUserManagementOpen(false)}
        />
      </div>
      
    </div>
  );
};

export default AdminNavbar;
