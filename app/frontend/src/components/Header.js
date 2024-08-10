// src/components/Header.js

import React from 'react';
import NotificationBell from './Instructor/NotificationBell';

const Header = (props) => {
  return (
    <div className="border-b border-white text-white justify-end space-x-8 flex my-8 mt-8 m-12 w-full">
      {props.role === 2 && <NotificationBell userId={props.userId} notifications={props.notifications} fetchNotifications={props.fetchNotifications}/>}
    </div>
  );
}

export default Header;
