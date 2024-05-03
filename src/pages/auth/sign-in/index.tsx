import { Grid, Typography, TextField, Stack, Button } from '@mui/material';
import { doPost } from '@utils/APIRequest';
import { getExpFromJWT } from '@utils/JWT';
import { setCookie } from '@utils/Cookie';

export default function SignIn() {
    const handleSignIn = async () => {
        const reqData = {
            phone: (document.getElementById('phone') as HTMLInputElement).value,
            password: (document.getElementById('password') as HTMLInputElement).value,
            role: "staff"
        }

        const response = await doPost('http://localhost:3000/api/accounts/sign-in', reqData);
        
        if (response.success) {
            setCookie('token', response.data.token, getExpFromJWT(response.data.token));
            window.location.href = '/staff/new-booking';
        }
    }

  return (
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
    >
      <Stack spacing={2} padding={2} sx={{ width: '25%' }}>
        <Typography variant="h4">
          Workspace Portal
        </Typography>
        <TextField id="phone" label="Phone number" variant="outlined" />
        <TextField id="password" label="Password" variant="outlined" type="password" />
        <Button variant="contained" onClick={handleSignIn}>Sign In</Button>
      </Stack>
    </Grid>
  );
}
