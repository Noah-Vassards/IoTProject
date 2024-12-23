import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

async function fetchAlarms(token) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dev/users/alarms`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        })
        if (response.ok) {
            const data = await response.json()
            return data
        }

    } catch (e) {
        console.error(e)
        return []
    }
}

async function fetchComponents(token) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dev/users/components`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        })
        if (response.ok) {
            const data = await response.json()
            return data
        }

    } catch (e) {
        console.error(e)
        return []
    }
}

export default function Home() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [components, setComponents] = useState([])
    const [alarms, setAlarms] = useState([])
    const [selected, setSelected] = useState('components')
  
    const onDisconnect = () => {
        navigate('/login')
    }

    const onClick = (selected) => {
        setSelected(selected)
    }


    useEffect(() => {
        const components = document.getElementById('components')
        const alarms = document.getElementById('alarms')

        if (selected === 'components') {
            components.setAttribute('class', 'grid-selector selected')
            alarms.setAttribute('class', 'grid-selector')
        } else {
            components.setAttribute('class', 'grid-selector')
            alarms.setAttribute('class', 'grid-selector selected')
        }
    }, [selected])

    useEffect(() => {
        async function fetchData() {
            if (selected === 'components') {
                setComponents(await fetchComponents(token))
            } else if (selected === 'alarms') {
                setAlarms(await fetchAlarms(token))
            }
        }
        if (!token) {
            navigate('/login')
        }
        const interval = setInterval(() => {
            fetchData()
        }, 10000);
        return () => clearInterval(interval);
    }, [selected]);

    useEffect(() => {
        async function fetchData() {
            setComponents(await fetchComponents(token))
            setAlarms(await fetchAlarms(token))
        }
        if (!token) {
            navigate('/login')
        }
        fetchData()
    }, [])


    return (
        <div className="home">
            <div className="header">
                <p>Bacchus</p>
                <div className="disconnect" onClick={onDisconnect}>
                    Se déconnecter
                </div>
            </div>
            <div className='body'>
                <div className='grid-container'>
                    <div className='grid-header'>
                        <div className='grid-selector' id="components" onClick={() => onClick('components')}><p>Capteurs</p></div>
                        <div className='grid-selector' id='alarms' onClick={() => onClick('alarms')}><p>Regulateurs</p></div>
                    </div>
                    {selected === 'components' ?
                        <div className='grid-body'>
                            <div className='grid-row no-hover'>
                                <p>Nom</p>
                                <p>UUID</p>
                                <p>Temperature</p>
                                <p>Humidité</p>
                            </div>
                            {components && components.map((c) =>
                                <div key={c.uuid} className='grid-row' onClick={() => navigate('/componentConfig', { state: { ...c } })}>
                                    <p>{c.name}</p>
                                    <p>{c.uuid}</p>
                                    <p>{c.data[c.data.length - 1]?.temperature ?? 0}</p>
                                    <p>{c.data[c.data.length - 1]?.humidity ?? 0}</p>
                                </div>
                            )}
                        </div> :
                        <div className='grid-body'>
                            <div className='grid-row no-hover'>
                                <p>Nom</p>
                                <p>UUID</p>
                                <p>Actif</p>
                            </div>
                            {alarms && alarms.map((a) =>
                                <div key={a.uuid} className='grid-row' onClick={() => navigate('/alarmConfig', { state: { ...a, token } })}>
                                    <p>{a.name}</p>
                                    <p>{a.uuid}</p>
                                    <p>{a.activated ? 'ON' : 'OFF'}</p>
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}