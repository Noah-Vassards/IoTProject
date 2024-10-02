import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css'

async function fetchAlarms(userId) {
    try {
        const response = await fetch(`http://localhost:3001/dev/users/${userId}/alarms`, {
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

async function fetchComponents(userId) {
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

async function addNewComponent(userId, uuid, entity) {
    try {
        const response = await fetch(`http://localhost:3001/dev/users/${userId}/${entity}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uuid: uuid })
        })
        if (response.ok) {
            return { status: 'Success', message: 'Le composant à été ajouté avec succès' }
        }
        return { status: 'Error', message: "Un problème est survenu lors de l'ajout du composant.\nVeuillez vérifier que l'uuid entré soit correcte" }
    } catch (e) {
        console.log(e)
        return { status: 'Error', message: "Un problème est survenu lors de l'ajout du composant.\nVeuillez vérifier que l'uuid entré soit correcte" }
    }
}

export default function Home() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [components, setComponents] = useState([])
    const [alarms, setAlarms] = useState([])
    const [selected, setSelected] = useState('components')
    const [openModal, setOpenModal] = useState(false)
    const [newUuid, setNewUuid] = useState('')
    const [notifMessage, setNotifMessage] = useState('')

    const onDisconnect = () => {
        navigate('/login')
    }

    const onClick = (selected) => {
        setSelected(selected)
    }

    const onClickNew = () => {
        setOpenModal(!openModal)
        setNewUuid('')
    }

    const onAddNew = () => {
        async function fetchData() {
            setNotifMessage(await addNewComponent(userId, newUuid, selected))
        }
        fetchData()
        setOpenModal(false)
        setNewUuid('')
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
        var e = document.getElementsByClassName('modal')[0];
        if (!openModal)
            e.style.display = 'none';
        else
            e.style.display = 'flex';
    }, [openModal])

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
                setComponents(await fetchComponents(userId))
            } else if (selected === 'alarms') {
                setAlarms(await fetchAlarms(userId))
            }
        }
        if (!userId) {
            navigate('/login')
        }
        const interval = setInterval(() => {
            fetchData()
        }, 10000);
        return () => clearInterval(interval);
    }, [selected]);

    useEffect(() => {
        async function fetchData() {
            setComponents(await fetchComponents(userId))
            setAlarms(await fetchAlarms(userId))
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setOpenModal(false)
            }
        })

        if (!userId) {
            navigate('/login')
        }
        fetchData()
    }, [])


    return (
        <div className="home">
            <ToastContainer />
            <div className='modal'>
                <input value={newUuid} onChange={(e) => setNewUuid(e.target.value)} placeholder={`Entrer l'uuid du ${selected === 'components' ? 'capteur' : 'régulateur'}`}></input>
                <button onClick={onAddNew} disabled={!newUuid.length}>Ajouter</button>
            </div>
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
                        <button id='add-button' onClick={onClickNew}>Ajouter nouveau</button>
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
                                <div key={a.uuid} className='grid-row' onClick={() => navigate('/alarmConfig', { state: { ...a, userId } })}>
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