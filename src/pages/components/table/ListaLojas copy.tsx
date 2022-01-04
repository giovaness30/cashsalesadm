import React from 'react';
import lojas from '../../data/lojas'
import { DataGrid, ptBR } from '@mui/x-data-grid';
// import { setCookie, parseCookies } from 'nookies'


const columnsLojas = [
    { field: 'id', headerName: 'Código',type: 'number', width: 100 },
    { field: 'cnpj', headerName: 'CNPJ/CPF', width: 150 },
    { field: 'nome', headerName: 'Nome', width: 270 },
    { field: 'fantasia', headerName: 'Fantasia', width: 250 },
    { field: 'ntablets', headerName: 'N° de Tablets', width: 120 },
  ];

// async function getToken(){
//     try {
//         const response = await fetch('http://localhost:3333/login', {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({user: 'app', pass: "ess2212"})
//         })
//         // console.log(response)
//         const login = await response.json()
//         const token = login.token
//         setCookie(undefined, 'sales-token', token, {maxAge:60 * 60 * 1, //1hour
//         })} catch (error) {
//         console.error(error)
//     }
// }


// getToken()

// async function getLojas() {

//     try{
//         const { 'sales-token': token } = parseCookies();
//         const response = await fetch('http://localhost:3333/lojas', {
//             method: 'GET',
//             headers: {'Authorization': 'Bearer ' + token},
//         })
//         const data = await response.json();
//         return data 
//     } catch(error) {
//         console.log(error)
//     }

// }




// async function getLojas(){
    
//     try {
//         const { 'sales-token': token } = parseCookies();

//         const response = await  fetch('http://localhost:3333/lojas', {
//             method: 'GET',
//             headers: {'Authorization': 'Bearer ' + token},
            
//         })
//         // console.log(response)
//         const lojasResp = await response.json()
//         const lojas = lojasResp.data;
        
//         // console.log(lojas);
        
//                      return await (lojas);
//         // console.log(rowsLojas);
//     } catch (error) {
//         console.error(error)
//     }
// }


//   const rowsLojas = [{id: 1, cnpj: '1245565', nome: 'loja', fantasia: 'fantasia'}];
// const rowsLojas = getLojas();
// rowsLojas.then(lojas => {
//     lojas.map((loja, i) => ({id: loja.idloja, cnpj: loja.cnpj, nome: loja.nome,
//         fantasia: loja.fantasia}));
// })

// console.log(rowsLojas)

  
//   const rowsLojas = 
//     lojas.map((loja, i) => ({id: loja.codigo, cnpj: loja.cnpj, nome: loja.nome,
//          fantasia: loja.fantasia, ntablets: loja.ntablets}))


  
  export default function DataTable() {

    // const { 'sales-token': token } = parseCookies();
    //     fetch('http://localhost:3333/lojas', {
    //         method: 'GET',
    //         headers: {'Authorization': 'Bearer ' + token},
    //     }).then(response => {response.json()
    //         .then( data => showLojasFunc(data.data))})
    //     .catch(e => console.log(e.message))

    //     const showLojasFunc = (result) => {

    //         const loujas = []
    //         for(let i = 0; i< result.length; i++){
    //             loujas.push({id: result[i].IDLOJA, cnpj: result[i].CNPJ})
    //         }
    //         return loujas
    //         // console.log(loujas)
    //     }
        // const novoArray = showLojasFunc.data.map((item) => ({
        //     id: item.idloja
        // }))
        // console.log(novoArray);

        // const rowsLojas = [{id: 1, cnpj: '1245565', nome: 'loja', fantasia: 'fantasia'}];
        const rowsLojas = lojas
        console.log(rowsLojas)
        // console.log(showLojasFunc)

    return (
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows= {rowsLojas}
          columns={columnsLojas}
          pageSize={9}
          rowsPerPageOptions={[1]}
          checkboxSelection
        />
      </div>
    );
  }