import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { parseCookies } from 'nookies'

// Input material
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function listCompanys({ valueSelect, dispatch }) {
    const [companyList, setCompanys] = useState(['']);

const { 'sales-token': token } = parseCookies();


useEffect(() => {
    axios.get(`http://localhost:3333/lojas`, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(res => {
            setCompanys(res.data.data);
            

        })
}, [])
function setSelected(event) {
        return {
            type: 'SET_SELECT',
            select: event.target.value
        };
}
    return (
        <div>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Empresa</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={[valueSelect]}
                value={[valueSelect]}
                label="Empresa"
                onChange={(event) => dispatch(setSelected(event))}
            >
                <MenuItem disabled value="99999999999999">
                    <em>Selecionar...</em>
                </MenuItem>
                {companyList.map((company, index) => (<MenuItem key={index} value={company.CNPJ}>{company.NOME}</MenuItem>))}
            </Select>
        </FormControl>
    </div>
    );
}
export default connect(state => ({ valueSelect: state.select }))(listCompanys)