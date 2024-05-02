import { 
    Grid,
    useTheme, 
    useMediaQuery, 
    Typography,
    Stack,
    Button,
    Divider
} from "@mui/material";
import { eraseCookie } from "@utils/Cookie";
import * as React from 'react';
import { useNavigate } from "react-router-dom";

export default function Staff({children}: {children: React.ReactNode}){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const handleLogOut = () => {
      eraseCookie('token');
      navigate('/sign-in');
    }

    return (
      <Grid
        container
        spacing={2}
        columns={{ xs: 4, lg: 12 }}
        sx={{ width: '100vw', height: '100vh' }}
      >
        {!isMobile && (
          <Grid item lg={3}>
            <Stack spacing={2} padding={2}>
              <Typography variant="h5" align="left">
                Staff Workspace
              </Typography>
              <Button onClick={() => navigate('/staff/new-booking')}>
                New Booking
              </Button>
              <Button onClick={() => navigate('/staff/resolve-gps')}>
                Resolve GPS
              </Button>
              <Divider />
              <Button color="error" onClick={handleLogOut}>
                Logout
              </Button>
            </Stack>
          </Grid>
        )}

        {children}
      </Grid>
    );
}