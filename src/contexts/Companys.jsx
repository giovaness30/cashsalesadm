import React from 'react';

export const CompanyContext = React.createContext({});

export function CompanyProvider({children}){

    const listCompany = [{name:"teste",id: 1}]

return(
    <CompanyContext.Provider value={{listCompany}}>
        {children}
    </CompanyContext.Provider>
)
}