import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ComponentStats.css';
import GaugeReader from './GaugeReader';
import { ToastContainer, toast } from 'react-toastify';
import { LineChart } from '@mui/x-charts/LineChart';

async function getNewInfo(token, uuid) {
    try {
        const response = await fetch(`http://localhost:3001/dev/components/${uuid}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
            const data = await response.json()
            console.log(data)
            return data
        }
    } catch (e) {
        console.log()
        return {}
    }
}

async function updateComponent(token, uuid, updates) {
    try {
        const response = await fetch(`http://localhost:3001/dev/components/${uuid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        })
        if (response.ok) {
            return 1
        }
    } catch (e) {
        console.log()
        return 0
    }
}

export default function ComponentStats() {
    const navigate = useNavigate()
    const location = useLocation()
    const data = location.state
    const token = localStorage.getItem('token')
    const [name, setName] = useState('')
    const [readings, setReadings] = useState([])
    const [notifMessage, setNotifMessage] = useState('')
    const [selectedTempReading, setSelectedTempReading] = useState('actual')
    const [selectedHumidityReading, setSelectedHumidityReading] = useState('actual')

    const onSelectTempReading = (value) => {
        setSelectedTempReading(value)
    }

    const onSelectHumidityReading = (value) => {
        setSelectedHumidityReading(value)
    }

    const onDisconnect = () => {
        navigate('/login')
    }

    const onSaveChanges = async () => {
        const res = await updateComponent(token, data.uuid, { name })
        if (res) {
            setNotifMessage({ status: 'Success', message: "Le capteur à été modifé avec succès" })
        } else {
            setNotifMessage({ status: 'Error', message: 'Une erreur est survenue lors de la modification du capteur\nVeuillez réessayer ulterieurement' })
        }
    }

    useEffect(() => {
        if (!notifMessage.message)
            return
        if (notifMessage.status === 'Success')
            toast.success(notifMessage.message);
        else
            toast.error(notifMessage.message)
    }, [notifMessage])

    useEffect(() => {
        async function fetchData() {
            const newData = await getNewInfo(token, data.uuid)
            if (newData) {
                setReadings(newData.data)
            }
        }
        const interval = setInterval(() => {
            fetchData()
        }, 10000);
        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        async function fetchData() {
            const newData = await getNewInfo(token, data.uuid)
            if (newData) {
                setReadings(newData.data)
                setName(newData.name)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="home">
            <ToastContainer />
            <div className="header">
                <p>Bacchus</p>
                <div className="disconnect" onClick={() => onDisconnect()}>
                    Se déconnecter
                </div>
            </div>
            <div className='body'>
                <div className='component-header'>
                    <label>Nom du capteur: </label><input value={name} onChange={(e) => setName(e.target.value)}></input>
                    <div className='button-container'>
                        <button onClick={onSaveChanges}>Enregistrer</button>
                    </div>
                </div>
                <div className='readings-container'>
                    <div className='readings'>
                        <p>Température</p>
                        <select value={selectedTempReading} onChange={(e) => onSelectTempReading(e.target.value)}>
                            <option value={'actual'}>actuelle</option>
                            <option value={'average'}>moyenne</option>
                            <option value={'min-max'}>min-max</option>
                        </select>
                        <div style={{ display: selectedTempReading === 'actual' ? 'block' : 'none' }}>
                            <GaugeReader height={300} width={300} value={readings[readings.length - 1]?.temperature ?? 0} format="°C" />
                        </div>
                        <div style={{ height: 300, width: 300, display: selectedTempReading === 'average' ? 'block' : 'none' }}>
                            <label>38°C</label>
                        </div>
                        <div style={{ display: selectedTempReading === 'min-max' ? 'block' : 'none' }}>
                            <label>12°C</label>
                            <label>28°C</label>
                        </div>
                    </div>
                    <div className='readings'>
                        <p>Humidité</p>
                        <div style={{display: selectedTempReading === 'actual' ? 'block' : 'none' }}>
                            <GaugeReader height={300} width={300} value={readings[readings.length - 1]?.humidity ?? 0} format="%" />
                        </div>
                    </div>
                </div>
                <div className='chart-container'>
                    <label>Température (°C)</label>
                    <LineChart
                        xAxis={[{ data: readings.map(i => i.date), scaleType: 'band' }]}
                        series={[
                            {
                                data: readings.map(i => i.temperature)
                            },
                        ]}
                        width={1170}
                        height={500}
                        margin={{ left: 100, right: 20, top: 30, bottom: 40 }}
                    />
                </div>
                <div className='chart-container'>
                    <label>Humidité (%)</label>
                    <LineChart
                        xAxis={[{ data: readings.map(i => i.date), scaleType: 'band' }]}
                        series={[
                            {
                                data: readings.map(i => i.humidity),
                            },
                        ]}
                        width={1170}
                        height={500}
                        margin={{ left: 100, right: 20, top: 30, bottom: 40 }}
                    />
                </div>

                {/* <div className='grid-container'>
                    <div className='grid-header'>
                        <label>Historique</label>
                    </div>
                    <div className='grid-body'>
                        <div className='grid-row no-hover'>
                            <p>date</p>
                            <p>Temperature</p>
                            <p>Humidité</p>
                        </div>
                        {readings.map((d) =>
                            <div key={d.date} className='grid-row no-hover'>
                                <p>{d.date}</p>
                                <p>{d.temperature}</p>
                                <p>{d.humidity}</p>
                            </div>
                        )}
                    </div>
                </div> */}
            </div>
        </div >
    )
}