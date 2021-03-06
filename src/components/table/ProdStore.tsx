import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, RootStateOrAny } from 'react-redux'
import API from '../../api/api'
import { parseCookies } from 'nookies'

// Material UI
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridColDef,
  GridEnrichedColDef,
  GridActionsCellItem,
  GridValueOptionsParams
} from '@mui/x-data-grid'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputSelectStore from '../Input/InputSelectStore'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CloseIcon from '@mui/icons-material/Close'
import PtbrLanguage from '../../language/PtbrLanguage'

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
  const { 'sales-token': token } = parseCookies()
  const optionsApi = {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

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
  const columnsLojas: GridEnrichedColDef[] = [
    {
      field: 'id',
      headerName: 'C??digo',
      type: 'number',
      width: 80,
      align: 'center',
      headerAlign: 'center'
    },
    { field: 'name', headerName: 'Produto', width: 280 },
    { field: 'brand', headerName: 'Marca', width: 110, headerAlign: 'center' },
    {
      field: 'qty',
      headerName: 'Estoque',
      type: 'number',
      width: 90,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'unit',
      headerName: 'UN',
      type: 'string',
      width: 50,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Pre??os',
      getActions: params => [
        <GridActionsCellItem
          icon={<AttachMoneyIcon />}
          onClick={priceRow(params)}
          label="pre??os"
        />
      ]
    },
    { field: 'obs', headerName: 'Observa????o', width: 350 },
    { field: 'inactive', headerName: 'Inativo?', type: 'boolean', width: 100 },
    {
      field: 'datechange',
      headerName: 'Ultima Altera????o',
      type: 'date',
      width: 220,
      headerAlign: 'center',
      align: 'center',
      ...dateFormat
    }
    // { field: 'taxation', headerName: 'TRIB/CSOSN', width: 110 },
  ]

  const columnsPropre: GridColDef[] = [
    {
      field: 'id',
      headerName: 'C??digo',
      type: 'number',
      width: 80,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'grade',
      headerName: 'Grade',
      type: 'number',
      width: 80,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'preco',
      headerName: 'Pre??o',
      type: 'number',
      width: 80,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'markup',
      headerName: 'MarkUp',
      type: 'number',
      width: 80,
      align: 'center',
      headerAlign: 'center'
    }
  ]

  const priceRow = React.useCallback(
    params => () => {
      setProdToPropre(params.row.name)

      API.get(`/propre?cpfcnpj=${cnpj}&idpro=${params.id}`, optionsApi).then(
        res => {
          setListPropre(res.data.data)
        }
      )
      handleOpen()
    },
    []
  )

  // Faz requisi????o ao BackEnd quando CNPJ mudar e faz a lista de empresas para tabela
  useEffect(() => {
    API.get(`/produtos?cpfcnpj=${cnpj}`, optionsApi)
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
            obs: company.OBS
          }))
        )
      })
      .catch(error => {
        alert('Sem retorno do Banco de dados, Contate a Essystem !')
      })
    // .catch((error) => {
    //   alert(error + ', voc?? sera redirecionado')
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

  // Variaveis/estilos do Modal de pre??o
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4
            }}
          >
            <Stack justifyContent="center" alignItems="center" spacing={1}>
              <h3>Produto: {prodToPropre}</h3>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={listPropre.map(propre => ({
                    id: propre.idpreco,
                    grade: propre.idgra,
                    preco: 'R$: ' + propre.pvenda,
                    markup: propre.markup + '%'
                  }))}
                  columns={columnsPropre}
                  pageSize={6}
                  rowsPerPageOptions={[6]}
                  checkboxSelection={false}
                  localeText={PtbrLanguage}
                />
              </div>
              <Button
                variant="contained"
                onClick={handleClose}
                endIcon={<CloseIcon />}
              >
                Fechar
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </div>
  )
}
