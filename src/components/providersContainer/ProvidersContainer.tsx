"use client"
import CartContextProvider from '@/contextes/CartContext'
import { store } from '@/redux/store'
import React from 'react'
import { Provider } from 'react-redux'

export default function ProvidersContainer({children}: {children: React.ReactNode}){

    

  
    return (
        <Provider store={store}>


            <CartContextProvider>
                {children}
            </CartContextProvider>
            

        </Provider>
  )
}
