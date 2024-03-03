// App.jsx
import React, { useState } from 'react';
import StudMap from './components/StudMap';
import HomeMap from './components/HomeMap';

const App = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col justify-center items-center p-7 space-y-4">
        <h1 className="text-2xl font-semibold font-montserrat p-4">Bus Tracking System</h1>
        <button
          className={`flex px-4 py-2 rounded-full ${
            selectedRole === 'student' ? 'bg-blue-500 text-white font-palanquin' : 'bg-gray-300'
          }`}
          onClick={() => setSelectedRole('student')}
        >
          Student
        </button>
        <div className="flex flex-col items-center">
          <button
            className={`w-full px-4 rounded-t-lg py-2 selection:rounded ${
              selectedRole === 'driver1' ? 'bg-green-500 text-white font-palanquin' : 'bg-gray-300'
            }`}
            onClick={() => setSelectedRole('driver1')}
          >
            Annanur Bus
          </button>
          <button
            className={`w-full px-4 py-2 rounded-b-lg ${
              selectedRole === 'driver2' ? 'bg-green-500 text-white font-palanquin' : 'bg-gray-300'
            }`}
            onClick={() => setSelectedRole('driver2')}
          >
            Ambattur Bus
          </button>
        </div>
      </div>
      <div className="flex-1 flex">
        {selectedRole === 'student' ? <StudMap /> : null}
        {selectedRole === 'driver1' ? <HomeMap drive="Annanur" /> : null}
        {selectedRole === 'driver2' ? <HomeMap drive="Ambattur" /> : null}
      </div>
    </div>
  );
};

export default App;
