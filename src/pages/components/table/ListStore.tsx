import { setCookie, parseCookies } from 'nookies'
import React from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

async function getToken(){
    try {
        const response = await fetch('http://localhost:3333/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user: 'app', pass: "ess2212"})
        })
        // console.log(response)
        const login = await response.json()
        const token = login.token
        setCookie(undefined, 'sales-token', token, {maxAge:60 * 60 * 1, //1hour
        })} catch (error) {
        console.error(error)
    }
}


getToken()

const columnsLojas = [
    { field: 'id', headerName: 'Código',type: 'number', width: 100 },
    { field: 'cnpj', headerName: 'CNPJ/CPF', width: 150 },
    { field: 'nome', headerName: 'Nome', width: 270 },
    { field: 'fantasia', headerName: 'Fantasia', width: 250 },
    { field: 'ntablets', headerName: 'N° de Tablets', width: 120 },
    { field: 'edit',  headerName: 'Opções', width: 120, isEditMode:false}
  ];


    const { 'sales-token': token } = parseCookies();



    export default class StoreList extends React.Component {
        state = {
          stores: []
        }
        
      
        componentDidMount() {
          axios.get(`http://localhost:3333/lojas`, {
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
            <div style={{ height: 1020, width: '100%' }}>
                
            <DataGrid
              rows= {this.state.stores.map(store => ({id: store.IDLOJA, cnpj: store.CNPJ, nome: store.NOME, fantasia: store.FANTASIA, ntablets: store.NTABLET }))}
              columns={columnsLojas}
              pageSize={17}
              rowsPerPageOptions={[1]}
              checkboxSelection={false}
            />
          </div>
          )
        }
      }