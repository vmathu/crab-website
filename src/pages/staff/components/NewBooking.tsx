import { Grid, Typography, TextField, Stack, Autocomplete, Button } from '@mui/material';
import { Notification } from '@src/libs/ui/components';
import { doPost } from '@utils/APIRequest';
import * as React from 'react';
import { getPayload } from '@src/utils/JWT';
import { getCookie } from '@src/utils/Cookie';
import AutocompletePlaceResolver from './AutocompletePlaceResolver';

interface LocationValueProps {
  _id?: string;
  address: string;
  inputValue?: string;
}

interface VehicleProps {
  key: string;
  value: string;
}

export default function NewBookingComponent() {
  const [pickupValue, setPickupValue] = React.useState<LocationValueProps | null>(null);
  const [destinationValue, setDestinationValue] = React.useState<LocationValueProps | null>(null);

  const defaultVehicles: VehicleProps[] = [
    { key: 'motorbike', value: 'Motorbike' },
    { key: 'car', value: 'Car' },
  ];

  const handleSubmit = async () => {
    // Get the values from the form
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const vehicleValue = (document.getElementById('vehicle') as HTMLInputElement).value;
    const vehicle = defaultVehicles.find((item) => item.value === vehicleValue)?.key;
    const pick_up = {
      _id: pickupValue?._id || '',
      address: pickupValue?.address || '',
    };
    const destination = {
      _id: destinationValue?._id || '',
      address: destinationValue?.address || '',
    };
    const ordered_by = getPayload(getCookie('token') || '')._id;
    const reqData = {
      name,
      phone,
      vehicle,
      pick_up,
      destination,
      ordered_by,
    };

    // Send the data to the server
    const response = await doPost('http://localhost:3000/api/staff/bookings', reqData);

    if (response.success) {
      setSnackBarStatus(true);
      setOpen(true);

      // Clear the form
      (document.getElementById('name') as HTMLInputElement).value = '';
      (document.getElementById('phone') as HTMLInputElement).value = '';
      setPickupValue(null);
      setDestinationValue(null);

      // Update fee for orders associated with the location record
      if (pickupValue?._id)
        await doPost(`http://localhost:3000/api/location-records/${pickupValue?._id}/update-fee`, {});

      if (destinationValue?._id)
        await doPost(`http://localhost:3000/api/location-records/${destinationValue?._id}/update-fee`, {});
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
        message={snackBarStatus ? 'Booking created successfully' : 'Failed to create booking'}
      />
      <form>
        <Stack spacing={2}>
          <Typography variant='h6' fontWeight='600'>
            Customer&apos;s Information
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

          <AutocompletePlaceResolver
            label='Pickup'
            value={pickupValue}
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
          />

          <AutocompletePlaceResolver
            label='Destination'
            value={destinationValue}
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
          />
          <Button variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </form>
    </Grid>
  );
}
