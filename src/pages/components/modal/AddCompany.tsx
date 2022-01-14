import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { parseCookies } from 'nookies'
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Tablet } from '@mui/icons-material';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const { 'sales-token': token } = parseCookies();

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 400,
    bgcolor: 'background.paper',
    //   border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    '& .MuiTextField-root': { m: 1, width: '25ch' },
};

export default function BasicModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    
    const handleClose = () => {setOpen(false), clearInputs()}; 

    const [inputs, setInputs] = useState({
        Cpfcnpj: 0,
        Name:'',
        Fantasy: '',
        Tablet: 0 
    })

    const clearInputs = () => setInputs({ ...inputs, Cpfcnpj: 0 ,Name: "", Fantasy: "", Tablet: 0,});

    const [snackError, setSnackError] = React.useState(false);
    const [snackSuccess, setSnackSuccess] = React.useState(false);
    const [snackMsg, setSnackErrorMsg] = React.useState('');

    function postNewCompany() {
        var axios = require('axios');
        var data = JSON.stringify([
            {
                "CNPJ": inputs.Cpfcnpj,
                "NOME": inputs.Name,
                "FANTASIA": inputs.Fantasy
            }
        ]);

        var config = {
            method: 'post',
            url: 'http://localhost:3333/lojas',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.Y2FzaHNhbGVz.E4RD5jCd4yOyA9CyPqwD6HScbm7wL3LGQelknleYYmE',
                'Content-Type': 'application/json'

            },
            data: data
        };
        axios(config)
            .then(function (response) {
                const res = response.data[0];
                // console.log(res);
                if(res.IDLOJA){
                    setSnackSuccess(true);
                    setSnackErrorMsg(`Empresa id:${res.IDLOJA}, CPF/CNPJ:${res.CNPJ} Cadastrada com Suceso!`);
                    setInputs({ ...inputs, Cpfcnpj: 0 ,Name: "", Fantasy: "", Tablet: 0,});
                }else{
                    setSnackError(true);
                    setSnackErrorMsg(res.message);
                }
                
            })
            .catch(function (error) {
                setSnackError(true);
            });

    }


    return (
        <div>
            <Button onClick={handleOpen}>Adicionar +</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <TextField
                        required
                        id="inputCpfcnpj"
                        label="CPF/CNPJ"
                        type="number"
                        value={inputs.Cpfcnpj}
                        onChange={e => setInputs({ ...inputs, Cpfcnpj: Number(e.target.value)})}
                    />
                    <TextField
                        required
                        id="inputName"
                        label="Nome"
                        value={inputs.Name}
                        onChange={e => setInputs({ ...inputs, Name: e.target.value})}
                    />
                    <TextField
                        required
                        id="setInputFantasy"
                        label="Fantasia"
                        value={inputs.Fantasy}
                        onChange={e => setInputs({ ...inputs, Fantasy: e.target.value})}
                    />
                    <TextField
                        required
                        id="inputTablet"
                        label="Tablet"
                        type="number"
                        value={inputs.Tablet}
                        onChange={e => setInputs({ ...inputs, Tablet: Number(e.target.value)})}
                    />
                    <div>
                    <Button variant="contained" onClick={handleClose}>
                            Fechar
                        </Button>
                        <Button variant="contained" onClick={postNewCompany} endIcon={<SendIcon />}>
                            Salvar
                        </Button>
                    </div>

                    <div id="resultPostCompany"></div>
                </Box>
            </Modal>
            <Snackbar
                open={snackError}
                autoHideDuration={3000}
                anchorOrigin={{vertical: 'top', horizontal: 'right' }}
                onClose={() => { setSnackError(false) }}>
                <Alert onClose={() => { setSnackError(false) }} severity="error" sx={{ width: '100%' }}>
                    {snackMsg}
                </Alert>
            </Snackbar>
            <Snackbar
                open={snackSuccess}
                autoHideDuration={3000}
                anchorOrigin={{vertical: 'top', horizontal: 'right' }}
                onClose={() => { setSnackSuccess(false) }}>
                <Alert onClose={() => { setSnackSuccess(false) }} severity="success" sx={{ width: '100%' }}>
                    {snackMsg}
                </Alert>
            </Snackbar>
        </div>
    );
}
