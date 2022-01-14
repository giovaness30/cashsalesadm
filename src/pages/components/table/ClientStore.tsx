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

const columnsLojas = [
  { field: 'id', headerName: 'Código', type: 'number', width: 80, align: 'center', headerAlign: 'center' },
  { field: 'name', headerName: 'Cliente', type: 'string', width: 280, },
  { field: 'fantasy', headerName: 'Fantasia', type: 'string', width: 200, },
  { field: 'nickname', headerName: 'Apelido', type: 'number', width: 150, align: 'center', headerAlign: 'center' },
  { field: 'cnpjcpf', headerName: 'CNPJ/CPF', type: 'number', width: 150, headerAlign: 'center' },
  { field: 'ie', headerName: 'IE', type: 'number', width: 130, headerAlign: 'center' },
  { field: 'address', headerName: 'Endereço', type: 'string', width: 210 },
  { field: 'fone', headerName: 'Telefone', type: 'number', width: 130, align: 'center', headerAlign: 'center'},
  { field: 'obs', headerName: 'Observação', type: 'string', width: 350 }
];

export default function inputSelect() {

  const [companys, setCompanys] = useState([]);

  const { 'sales-token': token } = parseCookies();

  const cnpj = useSelector((state) => state.select)

  useEffect(() => {
    axios.get(`http://localhost:3333/clientes?cpfcnpj=${cnpj}&idvendedor=1`, {
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
              id: company.IDRC,
              name: company.NOME,
              fantasy: company.FANTASIA,
              nickname: company.APELIDO,
              cnpjcpf: company.CNPJCPF,
              ie: company.IE,
              address: company.ENDERECO,
              fone: company.FONE,
              obs: company.OBS,
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