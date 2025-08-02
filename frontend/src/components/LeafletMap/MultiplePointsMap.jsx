import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { IoMdLocate } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

// Fix Leaflet default marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MultiplePointsMap = ({data = [
  {
    id: 1,
    latitude: 28.6139,
    longitude: 77.2090,
    title: "New Delhi",
    description: "Reported garbage issue in Connaught Place"
  },
  {
    id: 2,
    latitude: 19.0760,
    longitude: 72.8777,
    title: "Mumbai",
    description: "Overflowing dustbin reported in Andheri"
  },
  {
    id: 3,
    latitude: 13.0827,
    longitude: 80.2707,
    title: "Chennai",
    description: "Plastic waste scattered in Marina Beach"
  },
  {
    id: 4,
    latitude: 22.5726,
    longitude: 88.3639,
    title: "Kolkata",
    description: "Burning of garbage near Park Street"
  }
]
 }) => {
  const [userPosition, setUserPosition] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef();
  const navigate = useNavigate();

  const fetchIpLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setUserPosition([data.latitude, data.longitude]);
      setError(null);
    } catch (err) {
      setError("Could not fetch location via IP.");
    }
  };

  const fetchLiveLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
        setError(null);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        fetchIpLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    fetchLiveLocation();
  }, []);

  useEffect(() => {
    if (userPosition && mapRef.current) {
      mapRef.current.flyTo(userPosition, 13, {
        animate: true,
        duration: 2
      });
    }
  }, [userPosition]);

  return (
    <div className="w-full h-screen relative">
      {userPosition && (
        <MapContainer
          center={userPosition}
          zoom={13}
          className="w-full h-full"
          whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Map View">
              <TileLayer
                url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite View">
              <TileLayer
                url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* User Marker */}
          <Marker position={userPosition}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Data Markers */}
          {data.map((item, index) => (
            <Marker key={index} position={[item.latitude, item.longitude]} eventHandlers={{
      click: () => {
        console.log("clicked")
        navigate(`/report/${item.id}`);
      },
    }}>
              <Popup>
                {item.description || "No description available"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-[1000]">
          {error}
        </div>
      )}

      <button
        onClick={fetchLiveLocation}
        className="absolute top-24 left-3 z-[1000] bg-blue-600 text-white p-2 rounded-full shadow"
        title="Refresh Location"
      >
        <IoMdLocate size={24} />
      </button>
    </div>
  );
};

export default MultiplePointsMap;
