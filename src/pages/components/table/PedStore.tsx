import React, { useEffect, useState } from 'react';
import Router from 'next/router'
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
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import PtbrLanguage from '../language/PtbrLanguage'

import { ThemeProvider } from '@mui/material/styles';

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
  const cnpj = useSelector((state) => state.select)

  const dateFormat = {
    valueFormatter: (params) => {
      const date = new Date(params.value);
      const dateFormatted = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      const timeFormatted = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `${dateFormatted} - ${timeFormatted}`;
    }
  };

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const brPrice = {
    type: 'number',
    width: 130,
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
    cellClassName: 'font-tabular-nums',
  };
  // Columns
  const columnsLojas = [
    { field: 'id', headerName: 'ID', type: 'number', width: 80, align: 'center', headerAlign: 'center', hide: true },
    { field: 'idped', headerName: 'Pedido', width: 80, align: 'center', headerAlign: 'center' },
    { field: 'idvendedor', headerName: 'Vendedor', type: 'number', width: 90, align: 'center', headerAlign: 'center' },
    { field: 'idrc', headerName: 'Codigo do Cliente', type: 'number', width: 140, align: 'center', headerAlign: 'center' },
    { field: 'cnpjcpf', headerName: 'CNPJ/CPF', type: 'number', width: 140, align: 'center', headerAlign: 'center' },
    { field: 'vprod', headerName: 'Valor Produto', type: 'number', width: 130, align: 'center', headerAlign: 'center', ...brPrice },
    { field: 'vacresc', headerName: 'Valor Acrescentado', type: 'number', width: 150, align: 'center', headerAlign: 'center', ...brPrice },
    { field: 'vdesc', headerName: 'Valor Desconto', type: 'number', width: 130, align: 'center', headerAlign: 'center', ...brPrice },
    { field: 'vliq', headerName: 'Valor Liquido', type: 'number', width: 130, align: 'center', headerAlign: 'center', ...brPrice },
    { field: 'obs', headerName: 'Observações', type: 'string', width: 220, align: 'center', headerAlign: 'center' },
    { field: 'dtemis', headerName: 'Data Criação', type: 'number', width: 80, align: 'center', headerAlign: 'center' },
    { field: 'dtfat', headerName: 'Data Faturamento', type: 'date', width: 150, align: 'center', headerAlign: 'center', ...dateFormat },
    { field: 'dtentregaprog', headerName: 'Entrega Programada', type: 'date', width: 150, align: 'center', headerAlign: 'center', ...dateFormat },
    { field: 'dttxdist', headerName: 'Pedido Enviado', type: 'date', width: 150, align: 'center', headerAlign: 'center', ...dateFormat },
    { field: 'idcond', headerName: 'Condição Pagamento', type: 'number', width: 140, align: 'center', headerAlign: 'center' },
    { field: 'indicador', headerName: 'Indicador', type: 'number', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'idtranspor', headerName: 'Transportadora', type: 'number', width: 140, align: 'center', headerAlign: 'center' },
    { field: 'endentrega', headerName: 'Endereço de entrega', type: 'string', width: 200, align: 'center', headerAlign: 'center' },
    { field: 'stnovarc', headerName: 'Cliente Novo?', type: 'boolean', width: 80, align: 'center', headerAlign: 'center' },

  ];


  // Faz requisição ao BackEnd quando CNPJ mudar e faz a lista de empresas para tabela
  useEffect(() => {
    API.get(`/pedido?cpfcnpj=${cnpj}`)
      .then(res => {
        setCompanys(
          res.data.data.map((company, index) => ({
            id: index,
            idped: company.IDPED,
            stnovarc: company.STVARC,
            dtemis: company.DTMEIS,
            vprod: company.VPROD,
            vacresc: company.VACRESC,
            vdesc: company.VDESC,
            vliq: company.VLIQ,
            obs: company.OBS,
            idrc: company.IDRC,
            idvendedor: company.IDVENDEDOR,
            dtfat: company.DTFATURAPROG,
            dtentregaprog: company.DTENTREGAPROG,
            idcond: company.IDCOND,
            dttxdist: company.DTTXDIST,
            idtranspor: company.IDTRANSPOR,
            cnpjcpf: company.CNPJCPF,
            indicador: company.INDICADOR,
            endentrega: company.ENDENTREGA,
          }))
        );
      })
    // .catch((error) => {
    //   alert(error + ', você sera redirecionado')
    //   const exitApp = Router.push('/')
    //   setTimeout(exitApp, 1000*15);
    // });
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
      </div>
    </div>
  )
};