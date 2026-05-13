import React, { useState } from 'react'
import { Coffee, Smartphone, Tablet } from 'lucide-react'

export default function App() {
  const [view, setView] = useState('customer')
  
  return (
    <div className="min-h-screen bg-[#2A1810] text-amber-50">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
            <Coffee className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-amber-50">福龍門市</h1>
            <p className="text-amber-200/60 text-xs italic">Coffee Cup System · Prototype</p>
          </div>
        </div>
        <div className="flex gap-2 bg-black/30 p-1 rounded-full">
          <button onClick={() => setView('customer')} className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition ${view === 'customer' ? 'bg-amber-50 text-amber-900 font-medium' : 'text-amber-200/70 hover:text-amber-100'}`}>
            <Smartphone className="w-4 h-4" />客人端
          </button>
          <button onClick={() => setView('store')} className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition ${view === 'store' ? 'bg-amber-50 text-amber-900 font-medium' : 'text-amber-200/70 hover:text-amber-100'}`}>
            <Tablet className="w-4 h-4" />門市端
          </button>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8">
        {view === 'customer' ? <CustomerView /> : <StoreView />}
      </main>
      <footer className="text-center py-8 text-amber-200/30 text-xs italic">
        Prototype · 福龍門市寄杯系統 · v0.2
      </footer>
    </div>
  )
}

function CustomerView() {
  return (
    <div className="bg-gradient-to-br from-amber-800 to-amber-950 rounded-3xl p-8 shadow-2xl">
      <p className="text-amber-200/70 text-xs uppercase tracking-widest italic mb-2">Your Coffee Wallet</p>
      <h2 className="text-amber-50 text-2xl font-bold mb-1">嗨,小華 👋</h2>
      <p className="text-amber-200/70 text-sm mb-8">您在福龍門市的寄杯</p>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-amber-50 text-7xl font-bold">16</span>
        <span className="text-amber-100 text-2xl">杯</span>
      </div>
      <p className="text-amber-200/60 text-sm mb-8">總餘額 · 上限 60 杯</p>
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-4 text-left hover:from-amber-500 hover:to-amber-600 transition">
          <div className="text-amber-50 font-medium mb-1">使用寄杯</div>
          <div className="text-amber-100/70 text-xs">點選想喝的</div>
        </button>
        <button className="bg-amber-50 text-amber-900 rounded-2xl p-4 text-left hover:bg-amber-100 transition">
          <div className="font-medium mb-1">掃 QR 領取</div>
          <div className="text-amber-700/70 text-xs">店員給的 QR</div>
        </button>
      </div>
    </div>
  )
}

function StoreView() {
  return (
    <div className="bg-amber-50 text-amber-900 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-2">門市端</h2>
      <p className="text-amber-700/70 text-sm mb-6">店員操作畫面(待搬移)</p>
      <div className="space-y-3">
        <div className="bg-amber-100 rounded-xl p-4">
          <div className="text-xs text-amber-700 uppercase tracking-wider mb-1">即將上線</div>
          <div className="font-medium">接單 · 銷帳 · 發杯 · 報表</div>
        </div>
      </div>
    </div>
  )
}
