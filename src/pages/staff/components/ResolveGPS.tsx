import { Typography } from '@mui/material';
import EditGPSModal from './EditGPSModal';
import { APIProvider } from '@vis.gl/react-google-maps';
import { doGet } from '@utils/APIRequest';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

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

const columns: GridColDef[] = [
  { field: 'id', headerName: 'No.', width: 70 },
  { field: 'address', headerName: 'Address', width: 330 },
];

function DataTable({
  onRowClick,
}: {
  onRowClick: (item: LocationValueProps) => void;
}) {
  const [rows, setRows] = useState<LocationValueProps[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await doGet(
        'http://localhost:3000/api/location-records/unresolved-list',
      );
      const formattedData = formatLocationData(response.data.data);
      const dataWithIds = formattedData.map(
        (item: LocationValueProps, index: number) => ({
          id: index + 1,
          ...item,
        }),
      );
      setRows(dataWithIds);
    };

    // Call fetchData immediately
    fetchData();

    // Then call fetchData every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        onRowClick={(row) => {
          onRowClick(row.row as LocationValueProps);
        }}
      />
    </div>
  );
}

export default function ResolveGPSComponent() {
  const [selectedData, setSelectedData] = useState<LocationValueProps | null>(
    null,
  );

  const [isModalOpen, setIsModalOpen] = useState(false); // Add this line

  const handleOpenModal = (item: LocationValueProps) => {
    setIsModalOpen(true);
    setSelectedData(item);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const API_KEY = 'AIzaSyAe_FAtgZw3zJZN9RySh-4WMVHzXruyuaA';

  return (
    <>
      <Typography variant='h6' fontWeight='600'>
        Unresolved GPS
      </Typography>
      <DataTable onRowClick={handleOpenModal} />
      {isModalOpen && (
        <APIProvider apiKey={API_KEY}>
          <EditGPSModal onClose={handleCloseModal} value={selectedData} />
        </APIProvider>
      )}
    </>
  );
}
