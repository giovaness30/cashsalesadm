import { createContext } from 'react';
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

type AuthContextType = {
    isAuthenticated: boolean,
    logIn(data: SingInData) : Promise<void>
}

type SingInData ={
    user: string,
    pass: string
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {

    const { 'sales-token': token } = parseCookies();

    const isAuthenticated = !!token;

    async function logIn({user, pass}: SingInData) {
        try {
            const response = await fetch('http://localhost:3333/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user, pass: pass })
            })
            // console.log(response)
            const login = await response.json()
            const token = login.token
            setCookie(undefined, 'sales-token', token, {
                maxAge: 60 * 60 * 1, //1hour
            })
            Router.push('/dashboard');

        } catch (error) {
            console.error(error)
        }
    }

return (
    <AuthContext.Provider value={{ isAuthenticated, logIn }}>
        {children}
    </AuthContext.Provider>
)
}