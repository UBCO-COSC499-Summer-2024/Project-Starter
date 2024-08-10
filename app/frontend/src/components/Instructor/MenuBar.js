import React from 'react';
import { useTheme } from '../../App';

const navigation = [
  { name: 'Tests', key: 'tests' },
  { name: 'Students', key: 'students' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MenuBar = ({ selectedMenu, setSelectedMenu }) => {
  const { theme } = useTheme();

  return (
    <div className="flex w-full">
      {navigation.map((item) => (
        <button
          key={item.key}
          onClick={() => setSelectedMenu(item.key)}
          className={classNames(
            selectedMenu === item.key ? `${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-400 text-black'}` : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-800 hover:bg-gray-500 hover:text-black'}`,
            'flex-1 text-center px-4 py-3 text-lg font-medium', // Increased padding and font size
          )}
          aria-current={selectedMenu === item.key ? 'page' : undefined}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default MenuBar;
