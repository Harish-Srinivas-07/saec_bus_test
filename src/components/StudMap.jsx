// FirebaseMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BusDot , BusPointer }from '../assets/images';

const firebaseConfig = {
    apiKey: "AIzaSyBKbLiASJslrnWe-tqVPZ0YDygFmUJwKWs",
  authDomain: "saec-bus-testing.firebaseapp.com",
  databaseURL: "https://saec-bus-testing-default-rtdb.firebaseio.com",
  projectId: "saec-bus-testing",
  storageBucket: "saec-bus-testing.appspot.com",
  messagingSenderId: "623748477674",
  appId: "1:623748477674:web:5c8e89eea337792af81d93"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const FirebaseMap = () => {
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    const driverName = 'Driver_route_annanur';

    // Set up Firebase listener to get updates on driver's location
    const locationRef = ref(database, `drivers/${driverName}`);
    const unsubscribe = onValue(locationRef, (snapshot) => {
      const location = snapshot.val();
      setDriverLocation(location);
      console.log("stud :get the location from firebase")
    });

    return () => {
      // Remove the Firebase listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const busMarkerIcon = L.icon({
    iconUrl: BusDot, // Replace with the actual path to your bus icon
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  return (
    <div className="py-20 flex-1 h-full bg-transparent">
      {driverLocation && (
        <MapContainer
          center={[driverLocation.latitude, driverLocation.longitude]}
          zoom={13}
          className="h-full w-full"
          style={{ backgroundColor: 'transparent' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[driverLocation.latitude, driverLocation.longitude]}
            icon={busMarkerIcon}
          >
            <Popup>
              Driver's Location: {driverLocation.latitude}, {driverLocation.longitude}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default FirebaseMap;
