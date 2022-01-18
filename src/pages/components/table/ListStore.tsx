import React, { useEffect, useState } from 'react';
import { connect, dispatch } from 'react-redux';
import PropTypes from 'prop-types';
import API from '../../../api/api';

import { useSelector } from 'react-redux';

// Material UI components
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton, ptBR,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import PtbrLanguage from '../language/PtbrLanguage';

// Import Modal
import AddCompany from '../modal/AddCompany';
import EditCompany from '../modal/EditCompany';
import { textAlign } from '@mui/system';

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

const storeList = ({ refreshTable , dispatch}) => {

  
  const [companys, setCompanys] = useState([]);

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


  // Snack e Alert const
  const [snackSuccess, setSnackSuccess] = React.useState(false);
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // const refresh = useSelector((state) => state.refresh);

  const columnsLojas = [
    { field: 'id', headerName: 'Código', type: 'number', width: 100 },
    { field: 'cnpj', headerName: 'CNPJ/CPF', width: 150 },
    { field: 'nome', headerName: 'Nome', width: 270 },
    { field: 'fantasia', headerName: 'Fantasia', width: 250 },
    { field: 'ntablets', headerName: 'N° de Tablets', width: 120 },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} onClick={editCompany(params.row)} label="preços" />
      ]
    },
  ];

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    '& .MuiTextField-root': { m: 1, width: '25ch' },
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [inputs, setInputs] = useState({
    idLoja: 0,
    cpfCnpj: 0,
    name: '',
    fantasy: '',
    tablet: 0
  })

  const editCompany = React.useCallback(
    (row) => () => {
      // console.log(row);
      setInputs({ ...inputs, idLoja: row.id, cpfCnpj: row.cnpj, name: row.nome, fantasy: row.fantasia, tablet: row.ntablets, });
      handleOpen()

    },
    [],
  );

  function salvarEditCompany() {
    var data = JSON.stringify({
      "IDLOJA": inputs.idLoja,
      "CNPJ": inputs.cpfCnpj,
      "NOME": inputs.name,
      "FANTASIA": inputs.fantasy,
      "NTABLET": inputs.tablet
    });

    API.patch(`/lojas`, data)
      .then(res => {
        setSnackSuccess(true);
        dispatch(setRefresh(true))
        handleClose()
        
      })
      // .catch((error) => {
      //   alert(error + ', você sera redirecionado')
      //   Router.push('/');
      // });
      

  }

  function setRefresh(refreshTable) {
    return{
        type: 'SET_REFRESH',
        refreshTable,
    };
    
}
  React.useEffect(() => {
    API.get(`/lojas?per_page=999`)
      .then(res => {
        setCompanys(res.data.data.map(company => ({
          id: company.IDLOJA,
          cnpj: company.CNPJ,
          nome: company.NOME,
          fantasia: company.FANTASIA,
          ntablets: company.NTABLET
        })));
        dispatch(setRefresh(false))
      })
      
      // .catch((error) => {
      //   alert(error + ', você sera redirecionado')
      //   Router.push('/');
      // });

  }, [refreshTable])

  return (

    <div style={{height: '80vh'}}>

      <AddCompany />
      <DataGrid
        rows={rows}
        columns={columnsLojas}
        pageSize={17}
        rowsPerPageOptions={[17]}
        checkboxSelection={false}
        localeText={PtbrLanguage}
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(''),
          },
        }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box sx={style}>
          <Stack
            justifyContent="center"
            alignItems="center"
            spacing={2}>
            <TextField
              id="inputCpfcnpj"
              label="CPF/CNPJ"
              type="number"
              value={inputs.cpfCnpj}
              onChange={e => setInputs({ ...inputs, cpfCnpj: Number(e.target.value) })}
              disabled
            />
            <TextField
              id="inputName"
              label="Nome"
              value={inputs.name}
              onChange={e => setInputs({ ...inputs, name: e.target.value })}
            />
            <TextField
              id="setInputFantasy"
              label="Fantasia"
              value={inputs.fantasy}
              onChange={e => setInputs({ ...inputs, fantasy: e.target.value })}
            />
            <TextField
              id="inputTablet"
              label="Tablet"
              value={inputs.tablet}
              onChange={e => setInputs({ ...inputs, tablet: Number(e.target.value) })}
            />
          </Stack>

          <Stack direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            spacing={2}>
            <Button variant="contained" onClick={salvarEditCompany} endIcon={<SendIcon />}>
              Salvar
            </Button>
            <Button variant="contained" onClick={handleClose} endIcon={<CloseIcon />}>
              Fechar
            </Button>
          </Stack>

        </Box>

      </Modal>

      <Snackbar
        open={snackSuccess}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => { setSnackSuccess(false) }}>
        <Alert onClose={() => { setSnackSuccess(false) }} severity="success" sx={{ width: '100%' }}>Empresa Alterada!</Alert>
      </Snackbar>

    </div>
  )
}
export default connect(state => ({refreshTable: state.refreshTable}))(storeList)