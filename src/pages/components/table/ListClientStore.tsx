import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { setCookie, parseCookies } from 'nookies'

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

const columnsLojas = [
  { field: 'id', headerName: 'Código', type: 'number', width: 80, align:'center', headerAlign: 'center' },
  { field: 'name', headerName: 'Produto', width: 280,  },
  { field: 'brand', headerName: 'Marca', width: 110, headerAlign: 'center' },
  { field: 'qty', headerName: 'Estoque', type: 'number', width: 90, align:'center', headerAlign: 'center' },
  { field: 'datechange', headerName: 'Ultima Alteração', type: 'date', width: 220, headerAlign: 'center' },
  { field: 'inactive', headerName: 'Inativo?', type: 'boolean', width: 100 },
  { field: 'taxation', headerName: 'TRIB/CSOSN', width: 110 },
  { field: 'obs', headerName: 'Observação', width: 350 }
  // { field: 'edit', headerName: 'Opções', width: 120, isEditMode: false }
];

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


export function listCompanys() {

  const [companys, setCompanys] = useState([]);

  const { 'sales-token': token } = parseCookies();

  const cnpj = useSelector((state) => state)

  axios.get(`http://localhost:3333/produtos?cpfcnpj=${cnpj.select}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(res => {
      setCompanys(res.data.data);
    })

  return (
    companys.map(company => ({ 
      id: company.IDPRO, 
      name: company.NOME, 
      brand:company.MARCA, 
      qty: company.QTE + ' ' + company.UNIDADE, 
      datechange: company.DTALT, 
      inactive: company.INATIVO, 
      ntablets: company.NTABLET,
      taxation: company.COD_TRIB + '/' + company.CSOSN,
      obs: company.OBS,
     }))
  )
}



export default function inputSelect() {
  return (
    <div>
      <InputSelectStore ></InputSelectStore>
      <div style={{ height: 1020, width: '100%', }}>
        <DataGrid
          rows={listCompanys()}
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