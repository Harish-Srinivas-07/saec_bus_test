// HomeMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BusPointer } from '../assets/images';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

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

const HomeMap = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });

            // Update Firebase with the new location
            updateFirebaseLocation(latitude, longitude);
            console.log("updated the location in firebase")
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getUserLocation();
  }, []);

  const updateFirebaseLocation = (latitude, longitude) => {
    const driverName = 'Driver_route_annanur';
    
    // Update the location in Firebase
    set(ref(database, `drivers/${driverName}`), {
      latitude,
      longitude,
    });
  };

  const busMarkerIcon = L.icon({
    iconUrl: BusPointer,
    iconSize: [50, 50],
    iconAnchor: [25, 50], // Center the icon on the marker
    popupAnchor: [0, -50], // Show the popup above the marker
  });

  return (
    <div className="py-20 flex-1 h-full bg-transparent">
      {userLocation && (
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={13}
          className="h-full w-full"
          style={{ backgroundColor: 'transparent' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={busMarkerIcon}
          >
            <Popup>Your current location</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default HomeMap;
