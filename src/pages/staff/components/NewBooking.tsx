import {
  Grid,
  Typography,
  TextField,
  Stack,
  Autocomplete,
  createFilterOptions,
  Button,
  debounce,
} from '@mui/material';
import { Notification } from '@src/libs/ui/components';
import { doPost } from '@utils/APIRequest';
import * as React from 'react';
import { doGet } from '@utils/APIRequest';

interface LocationValueProps {
  _id?: string;
  address: string;
  inputValue?: string;
}

interface VehicleProps {
  key: string;
  value: string;
}

const filter = createFilterOptions<LocationValueProps>();

function formatLocationData(rawData: any[]) {
  const formattedData = [];

  for (const item of rawData) {
    formattedData.push({
      _id: item._id,
      address: item.address,
    });
  }

  return formattedData;
}

export default function NewBookingComponent() {
  const [pickupValue, setPickupValue] =
    React.useState<LocationValueProps | null>(null);
  const [destinationValue, setDestinationValue] =
    React.useState<LocationValueProps | null>(null);
  const [pickUpData, setPickUpData] = React.useState<LocationValueProps[]>([]);
  const [destinationData, setDestinationData] = React.useState<
    LocationValueProps[]
  >([]);

  const defaultVehicles: VehicleProps[] = [
    { key: 'motorbike', value: 'Motorbike' },
    { key: 'car', value: 'Car' },
  ];

  const handleSubmit = async () => {
    // Get the values from the form
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const vehicleValue = (
      document.getElementById('vehicle') as HTMLInputElement
    ).value;
    const vehicle = defaultVehicles.find(
      (item) => item.value === vehicleValue,
    )?.key;
    const pick_up = {
      _id: pickupValue?._id || '',
      address: pickupValue?.address || '',
    };
    const destination = {
      _id: destinationValue?._id || '',
      address: destinationValue?.address || '',
    };
    const reqData = {
      name,
      phone,
      vehicle,
      pick_up,
      destination,
      ordered_by: '662b56165429d1344b0d6ad9',
    };

    // Send the data to the server
    const response = await doPost(
      'http://localhost:3000/api/staff/bookings',
      reqData,
    );

    if (response.success) {
      setSnackBarStatus(true);
      setOpen(true);

      // Clear the form
      (document.getElementById('name') as HTMLInputElement).value = '';
      (document.getElementById('phone') as HTMLInputElement).value = '';
      setPickupValue(null);
      setDestinationValue(null);
    } else {
      setSnackBarStatus(false);
      setOpen(true);
    }
  };

  const [open, setOpen] = React.useState(false);
  const [snackBarStatus, setSnackBarStatus] = React.useState(false);

  const handleClose = (_: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid item xs={4} lg={9}>
      <Notification
        snackbarProps={{ open, onClose: handleClose }}
        alertProps={{ severity: snackBarStatus ? 'success' : 'error' }}
        message={
          snackBarStatus
            ? 'Booking created successfully'
            : 'Failed to create booking'
        }
      />
      <form>
        <Stack spacing={2} padding={2}>
          <Typography variant='h5' align='left'>
            Customer's Information
          </Typography>

          <TextField id='name' label='Name' variant='outlined' />
          <TextField id='phone' label='Phone Number' variant='outlined' />
          <Autocomplete
            id='vehicle'
            options={defaultVehicles}
            getOptionLabel={(option) => option.value}
            renderInput={(params) => <TextField {...params} label='Vehicle' />}
            defaultValue={defaultVehicles[0]}
          />
          <Autocomplete
            value={pickupValue}
            onInputChange={async (_, newValue) => {
              // Debounce function
              const debouncedFetch = debounce(async () => {
                const rawData = await doGet(
                  `http://localhost:3000/api/location-records?address=${newValue}`,
                );
                setPickUpData(formatLocationData(rawData.data.data));
              }, 500);

              // Call the debounced function
              await debouncedFetch();
            }}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                setPickupValue({
                  address: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setPickupValue({
                  address: newValue.inputValue,
                });
              } else {
                setPickupValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.address,
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  address: `Add "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id='pick-up'
            options={pickUpData}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.address;
            }}
            renderOption={(props, option) => (
              <li key={option._id} {...props}>
                {option.address}
              </li>
            )}
            freeSolo
            renderInput={(params) => <TextField {...params} label='Pickup' />}
          />
          <Autocomplete
            value={destinationValue}
            onInputChange={async (_, newValue) => {
              // Debounce function
              const debouncedFetch = debounce(async () => {
                const rawData = await fetch(
                  `http://localhost:3000/api/location-records?address=${newValue}`,
                ).then((res) => res.json());
                setDestinationData(formatLocationData(rawData.data.data));
              }, 500);

              // Call the debounced function
              await debouncedFetch();
            }}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                setDestinationValue({
                  address: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setDestinationValue({
                  address: newValue.inputValue,
                });
              } else {
                setDestinationValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.address,
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  address: `Add "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id='destination'
            options={destinationData}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.address;
            }}
            renderOption={(props, option) => (
              <li key={option._id} {...props}>
                {option.address}
              </li>
            )}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label='Destination' />
            )}
          />
          <Button variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </form>
    </Grid>
  );
}
