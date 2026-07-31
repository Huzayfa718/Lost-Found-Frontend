import React, { PureComponent } from 'react'
import Footer from '../Footer'
import { Outlet } from 'react-router'
import Navbar from '../Navbar'

export class Root extends PureComponent {
  render() {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    )
  }
}

export default Root
