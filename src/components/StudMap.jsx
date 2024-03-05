// StudMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet library
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BusDot, BusPointer, BusStopIcon, CurrentLocationMarker } from '../assets/images'; // Import your marker images
import markersData from '../constant';

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

const StudMap = () => {
  const [driversLocation, setDriversLocation] = useState({});
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const driversRef = ref(database, 'drivers');
    const unsubscribe = onValue(driversRef, (snapshot) => {
      const locations = snapshot.val();
      setDriversLocation(locations);
      console.log("stud: get all drivers' locations from firebase");
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const busMarkerIcon = L.icon({
    iconUrl: BusDot,
    iconSize: [30, 30],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

  const currentLocationMarkerIcon = L.icon({
    iconUrl: CurrentLocationMarker,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
  const BusStopMarker = L.icon({
    iconUrl: BusStopIcon,
    iconSize: [25, 25],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

  return (
    <div className="flex-1 h-full bg-transparent">
      {userLocation.latitude !== 0 && userLocation.longitude !== 0 && (
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
            icon={currentLocationMarkerIcon}
          >
            <Popup>Your Current Location</Popup>
          </Marker>
          {markersData.map((marker) => (
            <Marker
              key={marker.name}
              position={[marker.lat, marker.long]}
              icon={BusStopMarker}
            >
              <Popup>{marker.name} Bus Stop</Popup>
            </Marker>
          ))}
          {Object.keys(driversLocation).map((driverName) => {
            const location = driversLocation[driverName];
            return (
              <Marker
                key={driverName}
                position={[location.latitude, location.longitude]}
                icon={busMarkerIcon}
              >
                <Popup>
                  {driverName} Bus
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default StudMap;
