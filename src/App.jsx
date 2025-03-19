import React, { useEffect, useState } from 'react'
import AllRoutes from './Routes/AllRoutes';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Preloader from './Pages/Preloader';

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {loading ?
        <Preloader />
        :
        <>
          <ToastContainer autoClose={3000} />
          <AllRoutes />
        </>}

    </>
  );
}

export default App;
