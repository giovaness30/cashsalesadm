import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import { useSelector, RootStateOrAny } from 'react-redux'
import API from '../../api/api'

// Material UI
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridColDef
} from '@mui/x-data-grid'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputSelectStore from '../Input/InputSelectStore'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PtbrLanguage from '../../language/PtbrLanguage'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { ThemeProvider } from '@mui/material/styles'

// Quick Filter Material UI
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
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
        flexWrap: 'wrap'
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
          )
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto'
          },
          m: theme => theme.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            mr: 0.5
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
            color: 'green'
          }
        }}
      />
    </Box>
  )
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default function inputSelect() {
  const [companys, setCompanys] = useState([])
  const [listPropre, setListPropre] = useState([])
  const [prodToPropre, setProdToPropre] = useState('')
  const cnpj = useSelector((state: RootStateOrAny) => state.select)

  const dateFormat = {
    valueFormatter: params => {
      const date = new Date(params.value)
      const dateFormatted = date.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
      })
      const timeFormatted = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
      return `${dateFormatted} - ${timeFormatted}`
    }
  }

  // Columns
  const columnsLojas: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Código',
      type: 'number',
      width: 80,
      align: 'center',
      headerAlign: 'center'
    },
    { field: 'name', headerName: 'Vendedor', type: 'string', width: 280 },
    { field: 'login', headerName: 'Login', type: 'string', width: 80 },
    {
      field: 'fone',
      headerName: 'Telefone',
      type: 'string',
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'tabDefault',
      headerName: 'Tabela de Preço',
      type: 'string',
      width: 130,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'dtAlt',
      headerName: 'Data Alteração',
      type: 'date',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      ...dateFormat
    },
    {
      field: 'password',
      headerName: 'Senha',
      type: 'string',
      width: 210,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'inactive',
      headerName: 'Inativo?',
      type: 'boolean',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      ...dateFormat
    },
    {
      field: 'maxOrder',
      headerName: 'Cod.Pedido Maior',
      type: 'number',
      width: 150,
      align: 'center',
      headerAlign: 'center'
    }
  ]

  // Faz requisição ao BackEnd quando CNPJ mudar e faz a lista de empresas para tabela
  useEffect(() => {
    API.get(`/vendedor?cpfcnpj=${cnpj}`)
      .then(res => {
        setCompanys(
          res.data.data.map(company => ({
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
        )
      })
      .catch(error => {
        alert('Sem retorno do Banco de dados, Contate a Essystem !')
      })
    // .catch((error) => {
    //   alert(error + ', você sera redirecionado')
    //   const exitApp = Router.push('/')
    //   setTimeout(exitApp, 1000*15);
    // });
  }, [cnpj])

  // Varaveis do filtros da Datagrid
  const [searchText, setSearchText] = React.useState('')
  const [rows, setRows] = React.useState(companys)

  const requestSearch = searchValue => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = companys.filter(row => {
      return Object.keys(row).some(field => {
        return searchRegex.test(row[field])
      })
    })
    setRows(filteredRows)
  }

  React.useEffect(() => {
    setRows(companys)
  }, [companys])

  return (
    <div>
      <InputSelectStore></InputSelectStore>
      <div style={{ height: '80vh', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columnsLojas}
          pageSize={16}
          rowsPerPageOptions={[16]}
          checkboxSelection={false}
          components={{ Toolbar: QuickSearchToolbar }}
          componentsProps={{
            toolbar: {
              value: searchText,
              onChange: event => requestSearch(event.target.value),
              clearSearch: () => requestSearch('')
            }
          }}
          localeText={PtbrLanguage}
        />
      </div>
    </div>
  )
}
