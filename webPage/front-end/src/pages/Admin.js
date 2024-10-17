import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css'

async function fetchAlarms(token) {
    try {
        const response = await fetch(`http://localhost:3001/dev/users/alarms`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
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
        const response = await fetch(`http://localhost:3001/dev/users/components`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
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

async function fetchUsers(token) {
    try {
        const response = await fetch(`http://localhost:3001/dev/users`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
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

export default function Admin() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [users, setUsers] = useState([])
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

    useEffect(() => {
        if (!notifMessage.message)
            return
        if (notifMessage.status === 'Success')
            toast.success(notifMessage.message);
        else
            toast.error(notifMessage.message)
    }, [notifMessage])

    // useEffect(() => {
    //     var e = document.getElementsByClassName('modal')[0];
    //     if (!openModal)
    //         e.style.display = 'none';
    //     else
    //         e.style.display = 'flex';
    // }, [openModal])

    // useEffect(() => {
    //     const components = document.getElementById('components')
    //     const alarms = document.getElementById('alarms')

    //     if (selected === 'components') {
    //         components.setAttribute('class', 'grid-selector selected')
    //         alarms.setAttribute('class', 'grid-selector')
    //     } else {
    //         components.setAttribute('class', 'grid-selector')
    //         alarms.setAttribute('class', 'grid-selector selected')
    //     }
    // }, [selected])

    useEffect(() => {
        async function fetchData() {
            if (selected === 'components') {
                setComponents(await fetchComponents(token))
            } else if (selected === 'alarms') {
                setAlarms(await fetchAlarms(token))
            }
            const usersData = await fetchUsers(token)
            setUsers(usersData.sort((a, b) => a.id - b.id))
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
            const usersData = await fetchUsers(token)
            setUsers(usersData.sort((a, b) => a.id - b.id))
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setOpenModal(false)
            }
        })

        if (!token) {
            navigate('/login')
        }
        fetchData()
    }, [])


    return (
        <div className="home">
            <ToastContainer />
            {/* <div className='modal'>
                <input value={newUuid} onChange={(e) => setNewUuid(e.target.value)} placeholder={`Entrer l'uuid du ${selected === 'components' ? 'capteur' : 'régulateur'}`}></input>
                <button onClick={onAddNew} disabled={!newUuid.length}>Ajouter</button>
            </div> */}
            <div className="header">
                <p>Bacchus</p>
                <div className="disconnect" onClick={onDisconnect}>
                    Se déconnecter
                </div>
            </div>
            <div className='body'>
                <div className='grid-container'>
                    <div className='grid-header'>
                        {/* <div className='grid-selector' id="components" onClick={() => onClick('components')}><p>Capteurs</p></div>
                        <div className='grid-selector' id='alarms' onClick={() => onClick('alarms')}><p>Regulateurs</p></div>
                        <button id='add-button' onClick={onClickNew}>Ajouter nouveau</button> */}
                    </div>
                    <div className='grid-body'>
                        <div className='grid-row no-hover'>
                            <p>ID</p>
                            <p>Nom</p>
                            <p>Email</p>
                            <p>Role</p>
                            <p>Capteurs</p>
                            <p>Régulateurs</p>
                        </div>
                        {users && users.map((u) =>
                            <div key={u.id} className='grid-row' onClick={() => { }}>
                                <p>{u.id}</p>
                                <p>{u.name}</p>
                                <p>{u.email}</p>
                                <p>{u.role}</p>
                                <p>{u.components?.length ?? 0}</p>
                                <p>{u.alarms?.length ?? 0}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}