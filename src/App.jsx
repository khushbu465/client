import React from 'react'
import AllRoutes from './Routes/AllRoutes';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <ToastContainer autoClose={3000} />
      <AllRoutes />
    </>
  );
}

export default App;
