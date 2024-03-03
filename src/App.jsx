// App.jsx
import React, { useState } from 'react';
import StudMap from './components/StudMap';
import HomeMap from './components/HomeMap';

const App = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="flex flex-col h-screen ">
      <h1 className="text-2xl font-semibold mb-8 px-7 py-7 font-montserrat">Bus Tracking System</h1>
      <div className="flex px-7">
        <button
          className={`mr-4 px-4 py-2 rounded ${
            selectedRole === 'student' ? 'bg-blue-500 text-white font-palanquin' : 'bg-gray-300'
          }`}
          onClick={() => setSelectedRole('student')}
        >
          Student
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedRole === 'driver' ? 'bg-green-500 text-white font-palanquin' : 'bg-gray-300'
          }`}
          onClick={() => setSelectedRole('driver')}
        >
          Driver
        </button>
      </div>
      <div className="flex-1 flex">
        {selectedRole === 'student' ? <StudMap /> : null}
        {selectedRole === 'driver' ? <HomeMap /> : null}
      </div>
    </div>
  );
};

export default App;
