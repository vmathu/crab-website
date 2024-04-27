import { 
    Grid,
    useTheme, 
    useMediaQuery, 
    Typography,
    Stack,
    Button
} from "@mui/material";
import * as React from 'react';
import { useNavigate } from "react-router-dom";

export default function Staff({children}: {children: React.ReactNode}){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    return (    
        <Grid container spacing={2} columns={{xs: 4, lg: 12}}>
            {!isMobile &&
                <Grid item lg={3}>
                    <Stack spacing={4} padding={4}>
                        <Typography variant="h5" align="left">Staff Workspace</Typography>
                        <Button onClick={() => navigate('/staff/new-booking')}>New Booking</Button>
                        <Button onClick={() => navigate('/staff/resolve-gps')}>Resolve GPS</Button>
                    </Stack>
                </Grid>
            }

            {children}
        </Grid>
    )
}