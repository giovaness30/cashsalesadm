import { parseCookies } from 'nookies'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid'
import { useSelector } from 'react-redux';

import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

import AddCompany from '../modal/AddCompany'
import EditCompany from '../modal/EditCompany'
import PtbrLanguage from '../language/PtbrLanguage'

const { 'sales-token': token } = parseCookies();


export default function StoreList() {

  const [companys, setCompanys] = useState([]);

  const refresh = useSelector((state) => state.refresh);

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
    // border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    '& .MuiTextField-root': { m: 1, width: '25ch' },
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [inputModalIdloja, setInputModalIdloja] = React.useState(' ');
  const [inputModalCpfcnpj, setInputModalCpfcnpj] = React.useState(' ');
  const [inputModalName, setInputModalName] = React.useState(' ');
  const [inputModalFantasy, setInputModalFantasy] = React.useState(' ');
  const [inputModalTablet, setInputModalTablet] = React.useState(' ');

  const editCompany = React.useCallback(
    (row) => () => {
      // console.log(row);
      setInputModalIdloja(row.idloja);
      setInputModalCpfcnpj(row.cnpj);
      setInputModalName(row.nome);
      setInputModalFantasy(row.fantasia);
      setInputModalTablet(row.ntablets);
      handleOpen()

    },
    [],
  );
  function salvarEditCompany(){
    const data = JSON.stringify([
      {
        "IDLOJA": {inputModalIdloja},
        "CNPJ": {inputModalCpfcnpj},
        "NOME": {inputModalName},
        "FANTASIA": {inputModalFantasy},
        "NTABLET": {inputModalTablet},
      }
    ]);

 
      axios.post(`http://localhost:3333/lojas`, {
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      data: data
    })
      .then(res => {
        console.log(res);

      })
    
  }


  React.useEffect(() => {
    axios.get(`http://localhost:3333/lojas`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => {
        const stores = res.data.data;
        setCompanys(stores);
      })
  }, [refresh])

  return (
    <div style={{ height: 1020, width: '100%' }}>
      <AddCompany />
      <DataGrid
        rows={companys.map(company => ({
          id: company.IDLOJA,
          cnpj: company.CNPJ,
          nome: company.NOME,
          fantasia: company.FANTASIA,
          ntablets: company.NTABLET
        }))}
        columns={columnsLojas}
        pageSize={17}
        rowsPerPageOptions={[17]}
        checkboxSelection={false}
        localeText={PtbrLanguage}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            id="inputCpfcnpj"
            label="CPF/CNPJ"
            value={inputModalCpfcnpj}
            onChange={e => setInputModalCpfcnpj(e.target.value)}
          />
          <TextField
            id="inputName"
            label="Nome"
            value={inputModalName}
            onChange={e => setInputModalName(e.target.value)}
          />
          <TextField
            id="setInputFantasy"
            label="Fantasia"
            value={inputModalFantasy}
            onChange={e => setInputModalFantasy(e.target.value)}
          />
          <TextField
            id="inputTablet"
            label="Tablet"
            value={inputModalTablet}
            onChange={e => setInputModalTablet(e.target.value)}
          />
          <Button variant="contained" onClick={salvarEditCompany} endIcon={<SendIcon />}>
            Salvar
          </Button>
        </Box>
      </Modal>
    </div>
  )
}