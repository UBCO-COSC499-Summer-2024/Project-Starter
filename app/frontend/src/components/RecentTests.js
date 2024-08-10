import React, { useEffect, useState } from 'react';
import getRecentTests from '../hooks/getRecentTests';


const RecentTests = (props) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const fetchData = async () => {
      const data = await getRecentTests(props.id);
      console.log(data);
      setTests(data);
      setLoading(false);
    }
    fetchData();
  }, [props.id]);

  if(loading) {
    return (
      <div className="p-4 flex flex-col min-h-screen">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold">Recent Tests</h2>
          <div className="mt-4">
          {tests.map((test, index) => (
              <div key={index} className="p-4 mb-4 rounded-lg bg-gray-700 text-white">
                <h3 className="text-xl font-bold">{test.name}</h3>
                {test.date_marked && <p className="text-lg">Date Marked: {test.date_marked.slice(0,10)}</p> }
                <p className="text-lg">Course: {test.course_name}</p> 
              </div>
            ))}
          </div>
        </div>
      </div>
      );
    };
};

export default RecentTests;
