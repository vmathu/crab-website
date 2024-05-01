import { Modal, Box, Typography, Button } from '@mui/material';
import { doPatch } from '@utils/APIRequest';
import {
  Map,
  Marker,
  useMap,
  useMapsLibrary,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import * as React from 'react';

interface LocationValueProps {
  _id: string;
  address: string;
}

interface EditGPSModalProps {
  onClose: () => void;
  value: LocationValueProps | null;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'wrap-content',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  gap: '16px',
  display: 'grid',
};

export default function EditGPSModal({ onClose, value }: EditGPSModalProps) {
  // const API_KEY = 'AIzaSyAe_FAtgZw3zJZN9RySh-4WMVHzXruyuaA';
  const [open, setOpen] = React.useState(true); // Open the modal by default
  const [position, setPosition] = React.useState({ lat: 0, lng: 0 });

  const handleClose = () => {
    setOpen(false); // Close the modal
    onClose(); // Call the onClose prop
  };

  const geocodingLibrary = useMapsLibrary('geocoding');
  const map = useMap();

  const [geocodingService, setGeocodingService] =
    React.useState<google.maps.Geocoder | null>(null);

  React.useEffect(() => {
    if (!geocodingLibrary || !map) {
      return;
    }

    setGeocodingService(new geocodingLibrary.Geocoder());
  }, [geocodingLibrary, map]);

  React.useEffect(() => {
    if (!geocodingService) return;

    geocodingService.geocode({ address: value?.address }, (results, status) => {
      if (status === 'OK' && results && map) {
        const newLocation = results[0].geometry.location;

        map.setCenter(newLocation);
        map.setZoom(20);

        setPosition({ lat: newLocation.lat(), lng: newLocation.lng() });
      }
    });
  }, [geocodingService]);

  const handleNewLocation = (event: MapMouseEvent) => {
    setPosition(event.detail.latLng as { lat: number; lng: number });
  };

  const handleUpdateGPS = async () => {
    // Get the current location
    const currPosition = {
      lat: position.lat,
      long: position.lng,
    };
    
    const data = {
      address: value?.address,
      location: currPosition,
    }

    const response = await doPatch(`http://localhost:3000/api/location-records/${value?._id}`, data);

    // Close the modal on success
    if (response.success) {
      handleClose();
      window.location.reload();
    }
  }

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" align="center">
            Edit GPS
          </Typography>
          {/* <APIProvider apiKey={API_KEY}> */}
          <Map
            style={{ width: '30vw', height: '30vh' }}
            defaultCenter={position}
            defaultZoom={20}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={'map'}
            onClick={handleNewLocation}
          >
            <Marker position={position} />
          </Map>
          {/* </APIProvider> */}
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" fontWeight={'bold'}>
              Địa chỉ:
            </Typography>
            <Typography variant="body1">{value?.address}</Typography>
          </Box>
          <Button variant="outlined" onClick={handleUpdateGPS}>Update GPS Record</Button>
        </Box>
      </Modal>
    </div>
  );
}
