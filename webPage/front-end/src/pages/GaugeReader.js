import React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export default function GaugeReader({ height, width, value, sections, format }) {

    const setGaugeColor = () => {
        if (value < sections[0] || value > sections[1]) return 'red'
        return 'green'
    }

    return (
        <div style={{ width: width, height: height, position: 'relative' }}>
            <Gauge
                value={value}
                width={width}
                height={height}
                thickness={10}
                startAngle={-90}
                endAngle={90}
                text=''
                sx={() => ({
                    [`& .${gaugeClasses.valueArc}`]: {
                        fill: setGaugeColor(),
                      }
                })}
            />
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -20%)',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: '#000',
                }}
            >
                {value}{format}
            </div>
        </div>
    );
};
