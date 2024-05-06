import { useEffect, useState } from 'react';
import '../../App.css';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const API_KEY = 'AIzaSyAe_FAtgZw3zJZN9RySh-4WMVHzXruyuaA';
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={currentLocation}
        defaultZoom={20}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <Marker position={currentLocation} />
      </Map>
    </APIProvider>
  );
}

export default App;
