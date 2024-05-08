import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Autocomplete,
  debounce,
} from '@mui/material';
import { doPatch, doPost } from '@utils/APIRequest';
import {
  Map,
  Marker,
  useMap,
  useMapsLibrary,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import * as React from 'react';
import { LocationValueProps } from './AutocompletePlaceResolver';
import parse from 'autosuggest-highlight/parse';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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

  const [destinationValue, setDestinationValue] =
    React.useState<LocationValueProps | null>(value);

  const handleClose = () => {
    setOpen(false); // Close the modal
    onClose(); // Call the onClose prop
  };

  const geocodingLibrary = useMapsLibrary('geocoding');
  const placesLibrary = useMapsLibrary('places');
  const map = useMap();

  const [geocodingService, setGeocodingService] =
    React.useState<google.maps.Geocoder | null>(null);
  const [autocompleteService, setAutocompleteService] =
    React.useState<google.maps.places.AutocompleteService | null>(null);

  const [autoCompleteValue, setAutocompleteValue] =
    React.useState<google.maps.places.AutocompletePrediction | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<
    readonly google.maps.places.AutocompletePrediction[]
  >([]);

  React.useEffect(() => {
    if (!geocodingLibrary || !map) {
      return;
    }

    setGeocodingService(new geocodingLibrary.Geocoder());
  }, [geocodingLibrary, map]);

  React.useEffect(() => {
    if (!placesLibrary) {
      return;
    }

    setAutocompleteService(new placesLibrary.AutocompleteService());
  }, [placesLibrary]);

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

  React.useEffect(() => {
    if (!geocodingService || !autoCompleteValue) return;

    geocodingService.geocode(
      { address: autoCompleteValue?.description },
      (results, status) => {
        if (status === 'OK' && results && map) {
          const newLocation = results[0].geometry.location;

          map.setCenter(newLocation);
          map.setZoom(20);

          setPosition({ lat: newLocation.lat(), lng: newLocation.lng() });
          setDestinationValue({ address: results[0].formatted_address });
        }
      },
    );
  }, [geocodingService, map, autoCompleteValue]);

  const debouncedFetch = React.useMemo(
    () =>
      debounce(
        async (
          request: { input: string },
          callback: (
            results?:
              | readonly google.maps.places.AutocompletePrediction[]
              | null,
          ) => void,
        ) => {
          // console.log('💸', autocompleteService);
          // return;
          await autocompleteService?.getPlacePredictions(request, callback);
        },
        500,
      ),
    [autocompleteService],
  );

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions(autoCompleteValue ? [autoCompleteValue] : []);
      return;
    }

    debouncedFetch(
      { input: inputValue },
      (
        results?: readonly google.maps.places.AutocompletePrediction[] | null,
      ) => {
        let newOptions: readonly google.maps.places.AutocompletePrediction[] =
          [];

        if (autoCompleteValue) {
          newOptions = [autoCompleteValue];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
        console.log(newOptions);
      },
    );
  }, [autoCompleteValue, debouncedFetch, inputValue]);

  const handleNewLocation = (event: MapMouseEvent) => {
    if (!geocodingService) return;

    const latlng = event.detail.latLng;
    geocodingService
      .geocode({ location: latlng })
      .then((response) => {
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

    const response = await doPatch(
      `http://localhost:3000/api/location-records/${value?._id}`,
      data,
    );

    // Close the modal on success
    if (response.success) {
      // Update fee for orders associated with the location record
      await doPost(
        `http://localhost:3000/api/location-records/${value?._id}/update-fee`,
        {},
      );
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
          <Autocomplete
            id='google-map-demo'
            sx={{ width: 300 }}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={autoCompleteValue}
            noOptionsText='No locations'
            onChange={(
              _event: any,
              newValue: google.maps.places.AutocompletePrediction | null,
            ) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setAutocompleteValue(newValue);
            }}
            onInputChange={async (_event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label='Add a location' fullWidth />
            )}
            isOptionEqualToValue={(option, value) =>
              option.place_id === value.place_id
            }
            renderOption={(props, option) => {
              const matches =
                option.structured_formatting.main_text_matched_substrings || [];

              const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match: any) => [
                  match.offset,
                  match.offset + match.length,
                ]),
              );

              return (
                <li {...props} key={option.place_id}>
                  <Grid container alignItems='center'>
                    <Grid item sx={{ display: 'flex', width: 44 }}>
                      <LocationOnIcon sx={{ color: 'text.secondary' }} />
                    </Grid>
                    <Grid
                      item
                      sx={{
                        width: 'calc(100% - 44px)',
                        wordWrap: 'break-word',
                      }}
                    >
                      {parts.map(
                        (
                          part: {
                            highlight: any;
                            text:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | null
                              | undefined;
                          },
                          index: React.Key | null | undefined,
                        ) => (
                          <Box
                            key={index}
                            component='span'
                            sx={{
                              fontWeight: part.highlight ? 'bold' : 'regular',
                            }}
                          >
                            {part.text}
                          </Box>
                        ),
                      )}
                      <Typography variant='body2' color='text.secondary'>
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              );
            }}
          />
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
          {/* TODO: CSS FIX ACCOUNTS FOR WORDWRAP */}
          <Box display='flex' justifyContent='space-between'>
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
