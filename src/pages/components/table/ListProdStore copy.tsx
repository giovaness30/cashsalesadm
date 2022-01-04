import { setCookie, parseCookies } from 'nookies'
import React from 'react';
import axios from 'axios';
import { DataGrid, 
  GridToolbarDensitySelector,
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';


import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useDemoData } from '@mui/x-data-grid-generator';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';




const columnsLojas = [
    { field: 'id', headerName: 'Código',type: 'number', width: 100 },
    { field: 'cnpj', headerName: 'CNPJ/CPF', width: 150 },
    { field: 'name', headerName: 'Produto', width: 270 },
    { field: 'qty', headerName: 'QTE', type: 'number', width: 100 },
    { field: 'datechange', headerName: 'Ultima Alteração',type: 'date', width: 220 },
    { field: 'edit',  headerName: 'Opções', width: 120, isEditMode:false}
  ];


    const { 'sales-token': token } = parseCookies();

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

    

    export default class StoreList extends React.Component {
        state = {
          stores: []
        }

        
        
      
        componentDidMount() {
          const cnpj = '99999999999999'
          axios.get(`http://localhost:3333/produtos?cpfcnpj=${cnpj}`, {
                    headers: {'Authorization': 'Bearer ' + token}})
            .then(res => {
              const stores = res.data.data;
              this.setState({ stores });
            })
        }
      
        

        // const rowsLojas =
        render() {
          
          return (
            // <ul>
            //   { this.state.persons.map(person => <li>Fantasia: {person.FANTASIA || 'sem cnpj informado'},CNPJ: {person.CNPJ}</li>)}
            // </ul>
            <div style={{ height: 640, width: '100%' }}>
                
            <DataGrid
              rows= {this.state.stores.map(store => ({id: store.IDPRO, name: store.NOME, qty: store.QTE, datechange: store.DTALT, ntablets: store.NTABLET }))}
              columns={columnsLojas}
              components={{ Toolbar: QuickSearchToolbar }}
              pageSize={19}
              rowsPerPageOptions={[1]}
              checkboxSelection={false}
            />
          </div>
          )
        }
      }