import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ComponentStats.css';
import GaugeReader from './GaugeReader';
import { ToastContainer, toast } from 'react-toastify';

async function deactivation(uuid) {
    try {
        const response = await fetch(`http://localhost:3001/dev/alarms/${uuid}/forceDeactivation`, {
            method: 'PATCH',
        })
        if (response.ok) {
            return 1
        }
        return 0
    } catch (e) {
        console.error(e)
        return 0
    }
}

async function getNewInfo(uuid) {
    try {
        const response = await fetch(`http://localhost:3001/dev/alarms/${uuid}`, {
            method: 'GET',
        })
        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (e) {
        console.error(e)
        return {}
    }
}

async function getUserComponents(userId) {
    try {
        const response = await fetch(`http://localhost:3001/dev/users/${userId}/components`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            const data = await response.json()
            return data
        }
        return []
    } catch (e) {
        console.error(e)
        return []
    }
}

async function updateAlarm(uuid, updates) {
    try {
        const response = await fetch(`http://localhost:3001/dev/alarms/${uuid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        })
        if (response.ok) {
            return 1
        }
        return 0
    } catch (e) {
        console.error(e)
        return 0
    }
}

export default function AlarmStats() {
    const navigate = useNavigate()
    const location = useLocation()
    const data = location.state
    const userId = data.userId
    const [components, setComponents] = useState([])
    const [linkedComponentUuid, setLinkedComponent] = useState(data?.linkedComponentUuid)
    const [temperatureRange, setTemperatureRange] = useState(data?.temperatureRange ?? [0, 100])
    const [humidityRange, setHumidityRange] = useState(data?.humidityRange ?? [0, 100])
    const [name, setName] = useState(data?.name ?? 'Nouveau Capteur')
    const [activated, setActivated] = useState(data?.activated ?? false)
    const [notifMessage, setNotifMessage] = useState('')

    const onDisconnect = () => {
        navigate('/login')
    }

    const onSaveChanges = async () => {
        const res = await updateAlarm(data.uuid, { name, temperatureRange, humidityRange, linkedComponentUuid })
        if (res) {
            setNotifMessage({status: 'Success', message: "Le capteur à été modifé avec succès"})
        } else {
            setNotifMessage({status: 'Error', message: 'Une erreur est survenue lors de la modification du capteur\nVeuillez réessayer ulterieurement'})
        }
    }

    const onSelectLinkedComponent = (newValue) => {
        setLinkedComponent(newValue)
    }

    const onForceStop = async () => {
        const res = await deactivation(data.uuid)
        if (res) {
            setActivated(false)
            setNotifMessage({status: 'Success', message: "Le régulateur a été stoppé avec succès"})
        } else {
            setNotifMessage({status: 'Error', message: "Le régulateur n'a pas pu être stoppé\nVeuillez réessayer ulterieurement"})
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
            setComponents(await getUserComponents(userId))
            const newInfos = await getNewInfo(data.uuid)
            setActivated(newInfos.activated)
        }

        if (userId) {
            fetchData()
            const interval = setInterval(() => {
                fetchData()
            }, 10000);
            return () => clearInterval(interval);
        }
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
                        <button id='force-stop' onClick={onForceStop} disabled={!activated}>Forcer l'arrêt</button>
                    </div>
                </div>
                <div className='component-selector'>
                    <label>Capteur lié:</label>
                    <select value={linkedComponentUuid} onChange={(e) => onSelectLinkedComponent(e.target.value)}>
                        {linkedComponentUuid !== "Aucun" ? <option key={0} value="">Aucun</option> : null}
                        {components?.map((c, key) => {
                            return <option key={key} value={c.uuid}>{c.name}</option>
                        })}
                    </select>

                </div>
                <div className='readings-container'>
                    <div className='readings'>
                        <p>Température</p>
                        {/* <GaugeReader height={300} width={300} value={readings[readings.length - 1]?.temperature ?? 0} sections={temperatureRange} format="°C" /> */}
                        <div className='value-setter'>
                            <div>
                                <label>Température min. : </label>
                                <input type="number" name='minTemperature' value={temperatureRange[0]} min={0} max={temperatureRange[1]} onChange={(e) => setTemperatureRange([e.target.value, temperatureRange[1]])}></input>
                            </div>
                            <div>
                                <label>Temperature max. : </label>
                                <input type="number" name='maxTemperature' value={temperatureRange[1]} min={temperatureRange[0]} max={100} onChange={(e) => setTemperatureRange([temperatureRange[0], e.target.value])}></input>

                            </div>
                        </div>
                    </div>
                    <div className='readings'>
                        <p>Humidité</p>
                        {/* <GaugeReader height={300} width={300} value={readings[readings.length - 1]?.humidity ?? 0} sections={humidityRange} format="%" /> */}
                        <div className='value-setter'>
                            <div>
                                <label>Humidité min. : </label>
                                <input type="number" name='minHumidity' value={humidityRange[0]} min={0} max={humidityRange[1]} onChange={(e) => setHumidityRange([e.target.value, humidityRange[1]])}></input>
                            </div>
                            <div>
                                <label>Humidité max. : </label>
                                <input type="number" name='maxHumidity' value={humidityRange[1]} min={humidityRange[0]} max={100} onChange={(e) => setHumidityRange([humidityRange[0], e.target.value])}></input>
                            </div>
                        </div>
                    </div>
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
        </div>
    )
}