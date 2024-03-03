// StudMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet library
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BusDot, BusPointer, CurrentLocationMarker } from '../assets/images'; // Import your marker images

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
  const [nearestDriver, setNearestDriver] = useState(null);

  useEffect(() => {
    // Set up Firebase listener to get updates on all drivers' locations
    const driversRef = ref(database, 'drivers');
    const unsubscribe = onValue(driversRef, (snapshot) => {
      const locations = snapshot.val();
      setDriversLocation(locations);
      console.log("stud: get all drivers' locations from firebase");
    });

    // Set up geolocation to get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          // Find the nearest driver
          const nearest = findNearestDriver({ latitude, longitude });
          setNearestDriver(nearest);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

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

  const currentLocationMarkerIcon = L.icon({
    iconUrl: CurrentLocationMarker, // Replace with the actual path to your current location marker icon
    iconSize: [20, 20],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  const findNearestDriver = (userLocation) => {
    let nearestDriver = null;
    let minDistance = Number.MAX_VALUE;

    Object.keys(driversLocation).forEach((driverName) => {
      const driverLocation = driversLocation[driverName];
      const distance = calculateDistance(userLocation, driverLocation);

      if (distance < minDistance) {
        nearestDriver = driverName;
        minDistance = distance;
      }
    });

    return nearestDriver;
  };

  const calculateDistance = (point1, point2) => {
    const lat1 = point1.latitude;
    const lon1 = point1.longitude;
    const lat2 = point2.latitude;
    const lon2 = point2.longitude;

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className="py-20 flex-1 h-full bg-transparent">
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
          {nearestDriver && (
            <Polyline
              positions={[
                [userLocation.latitude, userLocation.longitude],
                [
                  driversLocation[nearestDriver].latitude,
                  driversLocation[nearestDriver].longitude,
                ],
              ]}
              color="blue"
            />
          )}
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
