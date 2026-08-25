'use client'

import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { motion } from 'framer-motion'

// Mock Data
const accuracyData = [
  { epoch: 1, train_acc: 65.2, val_acc: 60.1 },
  { epoch: 2, train_acc: 72.5, val_acc: 68.4 },
  { epoch: 3, train_acc: 78.1, val_acc: 74.2 },
  { epoch: 4, train_acc: 82.4, val_acc: 79.8 },
  { epoch: 5, train_acc: 85.7, val_acc: 82.1 },
  { epoch: 6, train_acc: 88.3, val_acc: 84.5 },
  { epoch: 7, train_acc: 90.1, val_acc: 85.9 },
  { epoch: 8, train_acc: 91.5, val_acc: 87.2 },
  { epoch: 9, train_acc: 92.8, val_acc: 88.4 },
  { epoch: 10, train_acc: 93.6, val_acc: 89.1 },
]

const distributionData = [
  { name: 'Wheeze', value: 40 },
  { name: 'Crackle', value: 30 },
  { name: 'Normal', value: 30 },
]

const COLORS = ['#6dc4b5', '#e3a078', '#a6bbb5']

const inferences = [
  { id: 'INF-001', file: 'patient_A_342.wav', prediction: 'Wheeze', confidence: 92, time: '2 mins ago' },
  { id: 'INF-002', file: 'patient_B_112.wav', prediction: 'Normal', confidence: 96, time: '15 mins ago' },
  { id: 'INF-003', file: 'patient_C_089.wav', prediction: 'Crackle', confidence: 84, time: '1 hour ago' },
  { id: 'INF-004', file: 'patient_D_551.wav', prediction: 'Mixed', confidence: 76, time: '3 hours ago' },
]

export function ModelAccuracyChart() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[300px] w-full" />

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
          <XAxis dataKey="epoch" stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--paper)', borderColor: 'var(--line)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--foreground)', fontSize: '12px' }}
            labelStyle={{ color: 'var(--muted)', fontSize: '10px' }}
          />
          <Line type="monotone" dataKey="train_acc" name="Training Accuracy" stroke="var(--teal)" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="val_acc" name="Validation Accuracy" stroke="var(--status)" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DatasetDistributionChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[250px] w-full" />

  return (
    <div className="h-[250px] w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={distributionData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {distributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--paper)', borderColor: 'var(--line)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--foreground)', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
        <span className="text-[28px] font-bold text-[var(--teal)]">3</span>
        <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-mono">Classes</span>
      </div>
    </div>
  )
}

export function RecentInferencesTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--line)]">
            <th className="py-3 px-4 text-[10px] uppercase font-mono text-[var(--muted)] tracking-wider">ID</th>
            <th className="py-3 px-4 text-[10px] uppercase font-mono text-[var(--muted)] tracking-wider">File</th>
            <th className="py-3 px-4 text-[10px] uppercase font-mono text-[var(--muted)] tracking-wider">Prediction</th>
            <th className="py-3 px-4 text-[10px] uppercase font-mono text-[var(--muted)] tracking-wider">Confidence</th>
            <th className="py-3 px-4 text-[10px] uppercase font-mono text-[var(--muted)] tracking-wider text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          {inferences.map((inf, i) => (
            <motion.tr 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={inf.id} 
              className="border-b border-[var(--line)] hover:bg-[var(--mint)] transition-colors"
            >
              <td className="py-4 px-4 text-[11px] font-mono text-[var(--teal)]">{inf.id}</td>
              <td className="py-4 px-4 text-[13px]">{inf.file}</td>
              <td className="py-4 px-4">
                <span className="inline-block px-2 py-1 rounded bg-[color-mix(in_srgb,var(--paper)_80%,transparent)] border border-[var(--line)] text-[11px]">
                  {inf.prediction}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--teal)]" 
                      style={{ width: `${inf.confidence}%` }} 
                    />
                  </div>
                  <span className="text-[11px] font-mono">{inf.confidence}%</span>
                </div>
              </td>
              <td className="py-4 px-4 text-[11px] text-[var(--muted)] text-right">{inf.time}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
