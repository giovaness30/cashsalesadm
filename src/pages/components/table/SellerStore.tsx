import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { parseCookies } from 'nookies'

// Material UI
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import InputSelectStore from '../InputSelectStore';


import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

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
        <GridToolbarFilterButton placeholder="Filtros" />
      </div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Pesquisar…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
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

const dateFormat = {
  valueFormatter: (params) => {
    const date = new Date(params.value);
    const  dateFormatted = date.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
    const  timeFormatted = date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
   return `${dateFormatted} - ${timeFormatted}`;
  }
};

const columnsLojas = [
  { field: 'id', headerName: 'Código', type: 'number', width: 80, align: 'center', headerAlign: 'center' },
  { field: 'name', headerName: 'Vendedor', type: 'string', width: 280, },
  { field: 'login', headerName: 'Login', type: 'string', width: 80, },
  { field: 'fone', headerName: 'Telefone', type: 'string', width: 150,align: 'center', headerAlign: 'center'  },
  { field: 'tabDefault', headerName: 'Tabela de Preço', type: 'string', width: 130, align: 'center', headerAlign: 'center' },
  { field: 'dtAlt', headerName: 'Data Alteração', type: 'date', width: 200, align: 'center', headerAlign: 'center', ...dateFormat },
  { field: 'password', headerName: 'Senha', type: 'string', width: 210, align: 'center', headerAlign: 'center' },
  { field: 'inactive', headerName: 'Inativo?', type: 'boolean', width: 200, align: 'center', headerAlign: 'center', ...dateFormat },
  { field: 'maxOrder', headerName: 'Cod.Pedido Maior', type: 'number', width: 150, align: 'center', headerAlign: 'center' },
  
];

export default function inputSelect() {

  const [companys, setCompanys] = useState([]);

  const { 'sales-token': token } = parseCookies();

  const cnpj = useSelector((state) => state.select)

  useEffect(() => {
    axios.get(`http://localhost:3333/vendedor?cpfcnpj=${cnpj}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => {
        setCompanys(res.data.data);
      })
  }, [cnpj])


  return (
    <div>
      <InputSelectStore ></InputSelectStore>
      <div style={{ height: 1020, width: '100%', }}>
        <DataGrid
          rows={
            companys.map(company => ({
              id: company.IDVENDEDOR,
              name: company.NOME,
              login: company.LOGIN,
              fone: company.TELEFONE,
              tabDefault: company.TABELADEFAULT,
              dtAlt: company.DTALT,
              password: company.SENHA,
              inactive: company.INATIVO,
              maxOrder: company.max_idped
            }))
          }
          columns={columnsLojas}
          components={{ Toolbar: QuickSearchToolbar }}
          pageSize={16}
          rowsPerPageOptions={[19]}
          checkboxSelection={false}
        />
      </div>
    </div>
  )
};