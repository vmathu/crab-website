import {
  AddRounded,
  CloseRounded,
  EditRounded,
  SaveRounded,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { doGet, doPatch, doPost } from '@src/utils/APIRequest';
import { useEffect, useState } from 'react';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  rows: GridRowModel[];
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, rows } = props;

  const handleClick = () => {
    const id = Math.max(...rows.map((row) => row.id), 0) + 1;
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', phone: '', role: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color='primary' startIcon={<AddRounded />} onClick={handleClick}>
        Tạo tài khoản mới
      </Button>
    </GridToolbarContainer>
  );
}

function DataTable() {
  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No.', width: 70, editable: true },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'phone', headerName: 'Phone', width: 130, editable: true },
    {
      field: 'role',
      headerName: 'Role',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'customer', 'driver', 'staff'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={'save_' + id}
              icon={<SaveRounded />}
              label='Save'
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={'cancel' + id}
              icon={<CloseRounded />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={'edit' + id}
            icon={<EditRounded />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await doGet(
        'http://localhost:3000/api/accounts/members',
      );
      const dataWithIds = response.data.data.map(
        (item: any, index: number) => ({
          id: index + 1,
          ...item,
        }),
      );
      setRows(dataWithIds);
    };

    fetchData();
  }, []);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    if (newRow.isNew) {
      const response = await doPost(
        'http://localhost:3000/api/accounts/sign-up',
        {
          name: newRow.name,
          phone: newRow.phone,
          role: newRow.role,
          password: '1',
        },
      );
      const updatedRow = {
        ...newRow,
        _id: response.data.data.id,
        isNew: false,
      };
      setRows([...rows, updatedRow]);
      return updatedRow;
    } else {
      console.log(newRow._id);
      await doPatch('http://localhost:3000/api/accounts', {
        _id: newRow._id,
        name: newRow.name,
        role: newRow.role,
      });
    }

    const updatedRow = { ...newRow, isNew: false };

    setRows(
      rows.map((row: GridRowModel) =>
        row.id === newRow.id ? updatedRow : row,
      ),
    );
    return updatedRow;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

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
        editMode='row'
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots['toolbar'],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, rows },
        }}
      />
    </div>
  );
}

export default function Members() {
  return (
    <>
      <Typography variant='h6' fontWeight='600'>
        Quản lý thông tin
      </Typography>
      <DataTable />
    </>
  );
}
