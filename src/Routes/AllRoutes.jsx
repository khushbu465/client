import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from '../Pages/Dashboard'
import Vehicle from '../Pages/Vehicle'
import Crew from '../Pages/Crew'
import Duty from '../Pages/Duty'

const AllRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/duty' element={<Duty />} />
                <Route path='/vehicle' element={<Vehicle />} />
                <Route path='/crew' element={<Crew />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AllRoutes
