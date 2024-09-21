import { useLocation, useNavigate } from 'react-router-dom'
import './Home.css'
import { useEffect, useState } from 'react'

async function fetchComponents(userId) {
    console.log(userId)
    try {
        const response = await fetch(`http://localhost:3001/dev/users/${userId}/components`, {
            method: 'GET',
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
    const [components, setComponents] = useState([])
    const userId = localStorage.getItem('userId')

    const onDisconnect = () => {
        navigate('/login')
    }

    const onSelect = (selected) => {
        const components = document.getElementById('components')
        const alarms = document.getElementById('alarms')

        if (selected === 'components') {
            components.setAttribute('class', 'grid-selector selected')
            alarms.setAttribute('class', 'grid-selector')
        } else {
            components.setAttribute('class', 'grid-selector')
            alarms.setAttribute('class', 'grid-selector selected')
        }
    }

    useEffect(() => {
        async function fetchData() {
            setComponents(await fetchComponents(userId))
        }

        if (!userId) {
            navigate('/login')
        } else {
            fetchData()
        }
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
                        <div className='grid-selector' id="components" onClick={() => onSelect('components')}><p>Components</p></div>
                        <div className='grid-selector' id='alarms' onClick={() => onSelect('alarms')}><p>Alarms</p></div>
                    </div>
                    <div className='grid-body'>
                        <div className='grid-row no-hover'>
                            <p>Name</p>
                            <p>UUID</p>
                            <p>Temperature</p>
                            <p>Humidité</p>
                        </div>
                        {components && components.map((c) => 
                            <div key={c.uuid} className='grid-row' onClick={() => navigate('/config', {state: {...c}})}>
                                <p>{c.name}</p>
                                <p>{c.uuid}</p>
                                <p>{c.temperature}</p>
                                <p>{c.humidity}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}