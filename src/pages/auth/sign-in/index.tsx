import {
  Grid,
  Typography,
  TextField,
  Stack,
  Button,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';
import { doPost } from '@utils/APIRequest';
import { getExpFromJWT } from '@utils/JWT';
import { setCookie } from '@utils/Cookie';

export default function SignIn() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const reqData = {
      phone: (document.getElementById('phone') as HTMLInputElement).value,
      password: (document.getElementById('password') as HTMLInputElement).value,
      role: 'staff',
    };

    const response = await doPost(
      'http://localhost:3000/api/accounts/sign-in',
      reqData,
    );

    if (response.success) {
      setCookie(
        'token',
        response.data.token,
        getExpFromJWT(response.data.token),
      );
      window.location.href = '/staff/new-booking';
    } else {
      setMessage(response.message);
      setOpen(true);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        columns={{ xs: 4, lg: 12 }}
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        component='form'
        onSubmit={handleSignIn}
      >
        <Stack spacing={2} padding={2} sx={{ width: '25%' }}>
          <Typography variant='h4' align='center'>
            Workspace Portal
          </Typography>
          <TextField
            id='phone'
            label='Phone number'
            variant='outlined'
            required
          />
          <TextField
            id='password'
            label='Password'
            variant='outlined'
            type='password'
            required
          />
          <Button variant='contained' type='submit'>
            Sign In
          </Button>
        </Stack>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={handleClose}
        message={message}
      />
    </>
  );
}
