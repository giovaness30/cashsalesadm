import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import API from '../../api/api'
import { parseCookies } from 'nookies'

// Input material
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { string } from 'prop-types'

function listCompanys({ valueSelect, dispatch }) {
  const [companyList, setCompanys] = useState(string[''])

  const { 'sales-token': token } = parseCookies()
  const optionsApi = {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  useEffect(() => {
    API.get(`/lojas?per_page=999`, optionsApi)
      .then(res => {
        setCompanys(res.data.data)
      })
      .catch(error => {
        alert('Sem retorno do Banco de dados, Contate a Essystem !')
      })
    // .catch((error) => {
    //     alert(error + ', você sera redirecionado')
    //     Router.push('/');
    //   });
  }, [])

  function setSelected(event) {
    return {
      type: 'SET_SELECT',
      select: event.target.value
    }
  }
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Empresa</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={[valueSelect]}
          value={[valueSelect.select]}
          label="Empresa"
          onChange={event => dispatch(setSelected(event))}
        >
          <MenuItem disabled value="99999999999999">
            <em>Selecionar...</em>
          </MenuItem>
          {companyList?.map((company, index) => (
            <MenuItem key={index} value={company.CNPJ}>
              {company.NOME}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
export default connect(state => ({ valueSelect: state }))(listCompanys)
