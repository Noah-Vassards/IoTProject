import Login from './pages/authentication/login';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/authentication/signup';
import Home from './pages/Home';
import ComponentStats from './pages/ComponentStats';
import HumidityGauge from './pages/GaugeReader';
import AlarmStats from './pages/AlarmStats';
import Admin from './pages/Admin';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/admin' element={<Admin />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/componentConfig' element={<ComponentStats />}/>
        <Route path='/alarmConfig' element={<AlarmStats />}/>
        <Route path='/test' element={<HumidityGauge />}/>
      </Routes>
    </>
  )
}

export default App;
