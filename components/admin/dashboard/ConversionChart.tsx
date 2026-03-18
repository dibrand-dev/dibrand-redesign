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
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFF', 
              borderRadius: '12px', 
              border: '1px solid #E5E7EB',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
          />
          <Line
            type="monotone"
            dataKey="visitas"
            stroke="#10B981"
            strokeWidth={4}
            dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#FFF' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Visitas Totales"
          />
          <Line
            type="monotone"
            dataKey="contactos"
            stroke="#a04c97"
            strokeWidth={4}
            dot={{ r: 4, fill: '#a04c97', strokeWidth: 2, stroke: '#FFF' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Contactos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
