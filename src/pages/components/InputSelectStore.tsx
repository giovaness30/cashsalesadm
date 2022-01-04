import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { parseCookies } from 'nookies'

// Input material
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export function listCompanys() {
    const [companys, setCompanys] = useState([]);

    const { 'sales-token': token } = parseCookies();

    axios.get(`http://localhost:3333/lojas`, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(res => {
            setCompanys(res.data.data);
        })

    return (
        
        companys.map(company => (<MenuItem value={company.CNPJ}>{company.NOME}</MenuItem>))
    )
}

function setSelected(event) {

    return {
        type: 'SET_SELECT',
        select: event.target.value
    };
}

const inputSelect = ({ valueSelect, dispatch }) => (

    <div>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Empresas</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={[valueSelect.select]}
                label="Empresas"
                onChange={(event) => dispatch(setSelected(event))}
            >
                <MenuItem disabled value="">
                    <em>Placeholder</em>
                </MenuItem>
                {listCompanys()}
            </Select>
        </FormControl>
    </div>

);

export default connect(state => ({ valueSelect: state }))(inputSelect)