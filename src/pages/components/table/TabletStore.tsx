import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../../../api/api';

// Material UI
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton, ptBR,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputSelectStore from '../Input/InputSelectStore';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AppBlockingIcon from '@mui/icons-material/AppBlocking';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PtbrLanguage from '../language/PtbrLanguage'

// Quick Filter Material UI
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function QuickSearchToolbar(props) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Pesquisar..."
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Limpar"
              aria-label="Limpar"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            mr: 0.5,
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
            color: 'green'
          },
        }}
      />
    </Box>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default function inputSelect() {
  const [companys, setCompanys] = useState([]);
  const [listPropre, setListPropre] = useState([]);
  const [prodToPropre, setProdToPropre] = useState('');
  const [idToDelete, setIdToDelete] = useState('');
  const cnpj = useSelector((state) => state.select)
  const [refreshRows, setRefreshRows] = useState(0)

  // Columns
  const columnsLojas = [
    { field: 'id', headerName: 'Código', type: 'number', width: 80, align: 'center', headerAlign: 'center', hide: true },
    { field: 'idvendedor', headerName: 'Vendedor', width: 130, headerAlign: 'center', align: 'center' },
    { field: 'numbermac', headerName: 'MAC', width: 150, headerAlign: 'center' },
    { field: 'active', headerName: 'ATIVO?', type: 'boolean', width: 100 },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem icon={<DeleteForeverIcon />} onClick={askDelete(params)} label="preços" />
      ]
    },

  ];

  const askDelete = React.useCallback(
    (params) => () => {
      console.log(params)
      setProdToPropre('Vendedor: ' + params.row.idvendedor + ' - MAC: ' + params.row.numbermac);
      setIdToDelete(params.row.idvendedor);
      handleOpen()
    },
    [],
  );
  const deleteTablet = () => {
    API.delete(`/tablet?cpfcnpj=${cnpj}&idvendedor=${idToDelete}`)
      .then(res => {
        console.log(res.data.data)
      })
    handleClose()
    console.log('Deleteado' + idToDelete);
    setRefreshRows(1)

  }

  // Faz requisição ao BackEnd quando CNPJ mudar e faz a lista de empresas para tabela
  useEffect(() => {
    API.get(`http://localhost:3333/tablet?cpfcnpj=${cnpj}`)
      .then(res => {
        setCompanys(
          res.data.data.map((company, index) => ({
            id: index,
            idvendedor: company.IDVENDEDOR,
            numbermac: company.MAC,
            active: company.ATIVO,
          }))
        );
        setRefreshRows(0);
      })
    // .catch((error) => {
    //   alert(error + ', você sera redirecionado')
    //   const exitApp = Router.push('/')
    //   setTimeout(exitApp, 1000*15);
    // });
  }, [cnpj, refreshRows])

  // Varaveis do filtros da Datagrid
  const [searchText, setSearchText] = React.useState('');
  const [rows, setRows] = React.useState(companys);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = companys.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field]);
      });
    });
    setRows(filteredRows);
  };

  React.useEffect(() => {
    setRows(companys);
  }, [companys]);

  // Variaveis/estilos do Modal de preço
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };


  return (
    <div>
      <InputSelectStore ></InputSelectStore>
      <div style={{ height: '80vh', width: '100%', }}>
        <DataGrid
          localeText={{ ptBR }}
          rows={rows}
          columns={columnsLojas}
          pageSize={16}
          rowsPerPageOptions={[16]}
          checkboxSelection={false}
          components={{ Toolbar: QuickSearchToolbar }}
          componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(''),
            },
          }}
          localeText={PtbrLanguage}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <Stack
              justifyContent="center"
              alignItems="center"
              spacing={1}>

              <h3>Deseja realmente Excluir o Tablet: ?</h3>
              <h4>{prodToPropre}</h4>
              <Stack direction="row"
                justifyContent="flex-end"
                alignItems="flex-end"
                spacing={2}>
                <Button variant="contained" onClick={handleClose} color="error" endIcon={<CloseIcon />}>
                  NÃO
                </Button>
                <Button variant="contained" onClick={deleteTablet} color="success" endIcon={<AppBlockingIcon />}>
                  SIM Excluir permanente
                </Button>

              </Stack>


            </Stack>
          </Box>
        </Modal>
      </div>
    </div>
  )
};