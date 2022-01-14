import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { parseCookies } from 'nookies'

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
import InputSelectStore from '../InputSelectStore';



import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { ThemeProvider } from '@mui/material/styles';

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

  // Columns

  const dateFormat = {
    valueFormatter: (params) => {
      const date = new Date(params.value);
      const dateFormatted = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      const timeFormatted = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `${dateFormatted} - ${timeFormatted}`;
    }
  };

  const columnsLojas = [
    { field: 'id', headerName: 'Código', type: 'number', width: 80, align: 'center', headerAlign: 'center' },
    { field: 'name', headerName: 'Produto', width: 280, },
    { field: 'brand', headerName: 'Marca', width: 110, headerAlign: 'center' },
    { field: 'qty', headerName: 'Estoque', type: 'number', width: 90, align: 'center', headerAlign: 'center' },
    { field: 'unit', headerName: 'UN', type: 'string', width: 50, align: 'center', headerAlign: 'center' },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Preços',
      getActions: (params) => [
        <GridActionsCellItem icon={<AttachMoneyIcon />} onClick={priceRow(params.id)} label="preços" />
      ]
    },
    { field: 'obs', headerName: 'Observação', width: 350 },
    { field: 'inactive', headerName: 'Inativo?', type: 'boolean', width: 100 },
    { field: 'datechange', headerName: 'Ultima Alteração', type: 'date', width: 220, headerAlign: 'center', align: 'center', ...dateFormat },
    // { field: 'taxation', headerName: 'TRIB/CSOSN', width: 110 },

  ];

  const priceRow = React.useCallback(
    (id) => () => {
      console.log(id)
    },
    [],
  );

  const [companys, setCompanys] = useState([]);

  const { 'sales-token': token } = parseCookies();

  const cnpj = useSelector((state) => state.select)

  // Faz requisição ao BackEnd quando CNPJ mudar e faz a lista de empresas para tabela
  useEffect(() => {
    axios.get(`http://localhost:3333/produtos?cpfcnpj=${cnpj}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => {
        setCompanys(
          res.data.data.map(company => ({
            id: company.IDPRO,
            name: company.NOME,
            brand: company.MARCA,
            qty: company.QTE,
            unit: company.UNIDADE,
            datechange: company.DTALT,
            inactive: company.INATIVO,
            ntablets: company.NTABLET,
            // taxation: company.COD_TRIB + '/' + company.CSOSN,
            obs: company.OBS,
          }))
        );
      })
  }, [cnpj])

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

  const styleModalPrice = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  return (
    <div>
      <InputSelectStore ></InputSelectStore>
      <div style={{ height: 1020, width: '100%', }}>
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
          <Box sx={styleModalPrice}>
            <div>ABRIU</div>
          </Box>
        </Modal>
      </div>
    </div>
  )
};