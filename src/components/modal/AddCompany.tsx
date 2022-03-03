import React, { useEffect, useState } from 'react'
import API from '../../api/api'
import { connect } from 'react-redux'
import { parseCookies } from 'nookies'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import SendIcon from '@mui/icons-material/Send'
import Snackbar from '@mui/material/Snackbar'
import InputMask from 'react-input-mask'

import CloseIcon from '@mui/icons-material/Close'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

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
  '& .MuiTextField-root': { m: 1, width: '25ch' }
}

const BasicModal = ({ refreshTable, dispatch }) => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false), clearInputs()
  }

  const { 'sales-token': token } = parseCookies()
  const optionsApi = {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  const [inputs, setInputs] = useState({
    cpfCnpj: '',
    name: '',
    fantasy: '',
    fone: '',
    email: '',
    tablet: 0
  })
  const [errorCpfCnpj, setErrorCpfCnpj] = useState(false)
  const [errorName, setErrorName] = useState(false)
  const [errorFantasy, setErrorFantasy] = useState(false)
  const [errorFone, setErrorFone] = useState(false)
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorTablet, setErrorTablet] = useState(false)

  const clearInputs = () =>
    setInputs({
      ...inputs,
      cpfCnpj: '',
      name: '',
      fantasy: '',
      fone: '',
      email: '',
      tablet: 0
    })

  const [snackError, setSnackError] = React.useState(false)
  const [snackSuccess, setSnackSuccess] = React.useState(false)
  const [snackMsg, setSnackErrorMsg] = React.useState('')

  function postNewCompany() {
    var data = JSON.stringify([
      {
        CNPJ: inputs.cpfCnpj,
        NOME: inputs.name,
        FANTASIA: inputs.fantasy,
        NTABLET: inputs.tablet,
        FONE: inputs.fone,
        EMAIL: inputs.email
      }
    ])
    API.post(`/lojas`, data, optionsApi)
      .then(response => {
        const res = response.data[0]
        // console.log(res);
        if (res.idloja) {
          setSnackSuccess(true)
          setSnackErrorMsg(
            `Empresa id:${res.idloja}, CPF/CNPJ:${res.cnpj} Cadastrada com Suceso!`
          )
          clearInputs()
          handleClose()
          dispatch(setRefresh(true))
        } else {
          setSnackError(true)
          setSnackErrorMsg(res.message)
          console.log(res)
        }
      })
      .catch(error => {
        setSnackError(true)
        console.log(error)
      })
  }
  const handleSubmit = e => {
    e.preventDefault()
    // // setInputs({ ...inputs, errorCpfCnpj: false , errorName: false, errorFantasy: false, errorTablet: false });

    setErrorCpfCnpj(false)
    setErrorName(false)
    setErrorFantasy(false)
    setErrorFone(false)
    setErrorEmail(false)
    setErrorTablet(false)

    if (
      inputs.cpfCnpj == '' ||
      inputs.cpfCnpj.length < 11 ||
      inputs.cpfCnpj.length > 14
    ) {
      setErrorCpfCnpj(true)
    }
    if (inputs.name == '') {
      setErrorName(true)
    }
    if (inputs.fantasy == '') {
      setErrorFantasy(true)
    }
    if (inputs.fone == '') {
      setErrorFone(true)
    }
    if (inputs.email == '') {
      setErrorEmail(true)
    }
    if (inputs.tablet < 0) {
      setErrorTablet(true)
    }
    if (
      inputs.cpfCnpj &&
      inputs.name &&
      inputs.fantasy &&
      inputs.tablet &&
      inputs.fone &&
      inputs.email
    ) {
      postNewCompany()
    }
  }
  // const refreshTable = useSelector((state) => state.refresh);

  function setRefresh(refreshTable) {
    return {
      type: 'SET_REFRESH',
      refreshTable
    }
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
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <InputMask
              mask={'99999999999999' || '99999999999'}
              maskChar=" "
              value={inputs.cpfCnpj}
              // type="number"
              onChange={e => setInputs({ ...inputs, cpfCnpj: e.target.value })}
            >
              {() => (
                <TextField
                  required
                  label="CPF/CNPJ"
                  value={inputs.cpfCnpj}
                  id="inputCpfcnpj"
                  error={errorCpfCnpj}
                />
              )}
            </InputMask>

            <TextField
              required
              id="inputName"
              label="Nome"
              value={inputs.name}
              onChange={e => setInputs({ ...inputs, name: e.target.value })}
              error={errorName}
            />
            <TextField
              required
              id="setInputFantasy"
              label="Fantasia"
              value={inputs.fantasy}
              onChange={e => setInputs({ ...inputs, fantasy: e.target.value })}
              error={errorFantasy}
            />
            <TextField
              required
              id="inputTablet"
              label="Tablet"
              type="number"
              value={inputs.tablet}
              onChange={e =>
                setInputs({ ...inputs, tablet: Number(e.target.value) })
              }
              error={errorTablet}
            />
            <TextField
              required
              id="inputTablet"
              label="Fone"
              type="phone"
              value={inputs.fone}
              onChange={e => setInputs({ ...inputs, fone: e.target.value })}
              error={errorFone}
            />
            <TextField
              required
              id="inputTablet"
              label="Email"
              value={inputs.email}
              onChange={e => setInputs({ ...inputs, email: e.target.value })}
              error={errorEmail}
            />
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <Button variant="contained" type="submit" endIcon={<SendIcon />}>
                Salvar
              </Button>
              <Button
                variant="contained"
                onClick={handleClose}
                endIcon={<CloseIcon />}
              >
                Fechar
              </Button>
            </Stack>
          </form>

          <div id="resultPostCompany"></div>
        </Box>
      </Modal>
      <Snackbar
        open={snackError}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => {
          setSnackError(false)
        }}
      >
        <Alert
          onClose={() => {
            setSnackError(false)
          }}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackSuccess}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => {
          setSnackSuccess(false)
        }}
      >
        <Alert
          onClose={() => {
            setSnackSuccess(false)
          }}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default connect(state => ({ refreshTable: state }))(BasicModal)
