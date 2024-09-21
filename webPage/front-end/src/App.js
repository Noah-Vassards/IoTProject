import Login from './pages/authentication/login';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/authentication/signup';
import Home from './pages/Home';
import ComponentStats from './pages/ComponentStats';
import HumidityGauge from './pages/GaugeReader';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/config' element={<ComponentStats />}/>
        <Route path='/test' element={<HumidityGauge />}/>
      </Routes>
    </>
  )
}

export default App;
