import {
  Grid,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Typography,
} from '@mui/material';
import * as React from 'react';
import EditGPSModal from './EditGPSModal';
import { APIProvider } from '@vis.gl/react-google-maps';
import { doGet } from '@utils/APIRequest';

interface LocationValueProps {
  _id: string;
  address: string;
}

function formatLocationData(rawData: any[]): LocationValueProps[] {
  const formattedData = [];

  for (const item of rawData) {
    formattedData.push({
      _id: item._id,
      address: item.address,
    } as LocationValueProps);
  }

  return formattedData;
}

export default function ResolveGPSComponent() {
  const [unresolvedData, setUnresolvedData] = React.useState<
    LocationValueProps[] | null
  >(null);
  const [selectedData, setSelectedData] =
    React.useState<LocationValueProps | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await doGet('http://localhost:3000/api/location-records/unresolved-list');
      setUnresolvedData(formatLocationData(response.data.data));
    };

    // Call fetchData immediately
    fetchData();

    // Then call fetchData every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const [isModalOpen, setIsModalOpen] = React.useState(false); // Add this line

  const handleOpenModal = (item: LocationValueProps) => {
    setIsModalOpen(true);
    setSelectedData(item);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const API_KEY = 'AIzaSyAe_FAtgZw3zJZN9RySh-4WMVHzXruyuaA';

  return (
    <Grid item xs={4} lg={9}>
      <Typography variant="h5" align="left" padding={2}>
        Unresolved GPS
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">No.</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="h6">Address</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {unresolvedData?.map((item, index) => (
            <TableRow key={item._id} onClick={() => handleOpenModal(item)}>
              <TableCell>{index + 1}</TableCell>
              <TableCell align="center">{item.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && (
        <APIProvider apiKey={API_KEY}>
          <EditGPSModal onClose={handleCloseModal} value={selectedData} />
        </APIProvider>
      )}
    </Grid>
  );
}
