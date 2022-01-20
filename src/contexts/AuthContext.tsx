import React, { createContext, useState } from 'react'
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import API from '../api/api'

import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

type AuthContextType = {
  isAuthenticated: boolean
  logIn(data: SingInData): Promise<void>
}

type SingInData = {
  user: string
  pass: string
}

export const AuthContext = createContext({} as AuthContextType)

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export function AuthProvider({ children }) {
  const [snackError, setSnackError] = useState(false)
  const { 'sales-token': token } = parseCookies()

  const isAuthenticated = !!token

  async function logIn({ user, pass }: SingInData) {
    // Snack e Alert const

    const data = JSON.stringify({ user: user, pass: pass })

    API.post(`/login`, data)
      .then(res => {
        const resMsg = res.data.message
        const resToken = res.data.token
        if (resMsg == 'sucesso') {
          const token = resToken
          setCookie(undefined, 'sales-token', token, {
            maxAge: 60 * 60 * 1 //1hour
          })
          Router.push('/dashboard')
        }
      })
      .catch(error => setSnackError(true))
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, logIn }}>
      {children}
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
          Usuário ou Senha Invalidos !
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  )
}
