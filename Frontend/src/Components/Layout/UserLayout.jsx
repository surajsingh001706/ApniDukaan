import React from 'react'
import Header from '../Common/Header'
import { Outlet} from 'react-router-dom'
import Footer from '../Common/Footer'

const UserLayout = () => {
  return (
    <>
    {/* Header */}
    <Header/>
    {/* Main Content */}
    <main>
      <Outlet/>
    </main>
    {/* Footer */}
    <Footer/> 

    </>
  )
}

export default UserLayout 