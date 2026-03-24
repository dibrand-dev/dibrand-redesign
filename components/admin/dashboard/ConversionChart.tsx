'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ConversionChartProps {
  data: any[];
}

export default function ConversionChart({ data }: ConversionChartProps) {
  return (
    <div className="h-[300px] w-full font-inter">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 600, fill: '#737785' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 600, fill: '#737785' }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFF', 
              borderRadius: '12px', 
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
              fontSize: '12px',
              fontWeight: 600
            }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ 
                paddingBottom: '30px', 
                fontSize: '9px', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em',
                color: '#737785'
            }}
          />
          <Line
            type="monotone"
            dataKey="visitas"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#FFF' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="VISITAS TOTALES"
          />
          <Line
            type="monotone"
            dataKey="contactos"
            stroke="#0040A1"
            strokeWidth={3}
            dot={{ r: 4, fill: '#0040A1', strokeWidth: 2, stroke: '#FFF' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="CONTACTOS"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
