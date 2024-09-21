import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ComponentStats.css';
import GaugeReader from './GaugeReader';

export default function ComponentStats() {
    const navigate = useNavigate()
    const location = useLocation()
    const data = location.state
    const [temperatureRange, setTemperatureRange] = useState(data?.temperatureRange ?? [0, 100])
    const [humidityRange, setHumidityRange] = useState(data?.humidityRange ?? [0, 100])

    const onDisconnect = () => {
        navigate('/login')
    }

    useEffect(() => {
        console.log(data)
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
                <div className='readings-container'>
                    <div className='readings'>
                        <p>Température</p>
                        <GaugeReader height={300} width={300} value={data?.temperature ?? 0} sections={temperatureRange} format="°C" />
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
                        <GaugeReader height={300} width={300} value={data?.humidity ?? 0} sections={humidityRange} format="%" />
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
            </div>
        </div>
    )
}