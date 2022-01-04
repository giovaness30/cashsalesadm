import React from 'react';
import lojas from '../../data/lojas'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';



export default props => {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function getLinhas() {
        return lojas.map((loja, i) => {
            return (
                <StyledTableRow key={loja.codigo} className={i % 2 === 0 ? 'par' : 'impar'}>

                    <StyledTableCell>{loja.codigo}</StyledTableCell>
                    <StyledTableCell>{loja.cnpj}</StyledTableCell>
                    <StyledTableCell>{loja.nome}</StyledTableCell>
                    <StyledTableCell>{loja.fantasia}</StyledTableCell>
                    <StyledTableCell>{loja.ntablet}</StyledTableCell>

                </StyledTableRow>
            )
        })
    }

    return (
        <div className="tabelaProdutos">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Codigo</StyledTableCell>
                            <StyledTableCell>cnpj</StyledTableCell>
                            <StyledTableCell>nome</StyledTableCell>
                            <StyledTableCell>fantasia</StyledTableCell>
                            <StyledTableCell>Numero de Tablet's</StyledTableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getLinhas()}

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                        <TablePagination rowsPerPageOptions={[5, 50]} />
                        </TableRow>
                        </TableFooter>
                    

                </Table>
            </TableContainer>
        </div>
    )
}