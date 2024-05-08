import { Modal, Box, Typography, Button } from '@mui/material';
import { doPatch, doPost } from '@utils/APIRequest';
import { Map, Marker, useMap, useMapsLibrary, MapMouseEvent } from '@vis.gl/react-google-maps';
import * as React from 'react';
import { LocationValueProps } from './AutocompletePlaceResolver';

interface EditGPSModalProps {
  onClose: () => void;
  value: LocationValueProps | null;
}

const style = {
  position: 'absolute',
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

  const [destinationValue, setDestinationValue] = React.useState<LocationValueProps | null>(value);

  const handleClose = () => {
    setOpen(false); // Close the modal
    onClose(); // Call the onClose prop
  };

  const geocodingLibrary = useMapsLibrary('geocoding');
  const map = useMap();

  const [geocodingService, setGeocodingService] = React.useState<google.maps.Geocoder | null>(null);

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
        setDestinationValue({ address: results[0].formatted_address });
      }
    });
  }, [geocodingService, map, value?.address]);

  const handleNewLocation = (event: MapMouseEvent) => {
    if (!geocodingService) return;

    const latlng = event.detail.latLng;
    geocodingService
      .geocode({ location: latlng })
      .then((response) => {
        console.log('handler: ', response);
        if (response.results[0]) {
          setPosition(latlng as { lat: number; lng: number });
          setDestinationValue({
            address: response.results[0].formatted_address,
          });
        }
      })
      .catch((e) => window.alert('Geocoder failed due to: ' + e));

    console.log(event.detail.latLng);
  };

  const handleUpdateGPS = async () => {
    // Get the current location
    const currPosition = {
      lat: position.lat,
      long: position.lng,
    };

    const data = {
      address: destinationValue?.address,
      location: currPosition,
    };

    const response = await doPatch(`http://localhost:3000/api/location-records/${value?._id}`, data);

    // Close the modal on success
    if (response.success) {
      // Update fee for orders associated with the location record
      await doPost(`http://localhost:3000/api/location-records/${value?._id}/update-fee`, {});
      handleClose();
      window.location.reload();
    }
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant='h6' align='center'>
            Edit GPS
          </Typography>
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
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='body1' fontWeight={'bold'}>
              Địa chỉ ghi nhận:
            </Typography>
            <Typography variant='body1'>{value?.address}</Typography>
          </Box>
          <Box>
            <Typography variant='body1' fontWeight={'bold'}>
              Địa chỉ chính thức:
            </Typography>
            <Typography variant='body1'>{destinationValue?.address}</Typography>
          </Box>
          <Button variant='outlined' onClick={handleUpdateGPS}>
            Update GPS Record
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
