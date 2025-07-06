import React, { PureComponent } from 'react'
import Footer from '../Footer'
import { Outlet } from 'react-router'
import Navbar from '../Navbar'

export class Root extends PureComponent {
  render() {
    return (
            <>
         <Navbar />
        <Outlet />
        <Footer />
      </>
    )
  }
}

export default Root