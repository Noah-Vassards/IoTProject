import { Gauge } from '@mui/x-charts/Gauge';
import React from 'react';

export default function GaugeReader({ height, width, value, format }) {
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
