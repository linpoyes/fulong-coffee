import React, { useState, useRef } from 'react'
import { Coffee, ArrowLeftRight, Flame, ChevronRight, ShoppingBag, ScanLine } from 'lucide-react'

// ============ 模擬資料 ============
const INITIAL_BALANCE = [
  { itemId: 'americano', name: '美式咖啡', count: 8, interchangeable: true },
  { itemId: 'latte', name: '拿鐵', count: 5, interchangeable: true },
  { itemId: 'mocha', name: '摩卡', count: 3, temp: 'hot' },
]

const CUP_LIMIT = 60

export default function App() {
  // 預設只看到客人端;門市端要透過「Logo 連點 3 下」才會解鎖
  const [view, setView] = useState('customer')
  const [storeUnlocked, setStoreUnlocked] = useState(false)
  
  // 連點計數:1.5 秒內點 3 下就解鎖
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef(null)
  
  function handleLogoClick() {
    clickCountRef.current += 1
    
    // 重置計時器
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0
    }, 1500)
    
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      
      if (storeUnlocked) {
        // 已解鎖 → 切到門市端
        setView('store')
      } else {
        // 第一次解鎖 → 解鎖 + 切到門市端
        setStoreUnlocked(true)
        setView('store')
      }
    }
  }
  
  function handleBackToCustomer() {
    setView('customer')
  }
  
  return (
    <div className="min-h-screen bg-[#2A1810] text-amber-50">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo 區塊:連點 3 下解鎖門市端 */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={handleLogoClick}
          title="" 
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
            <Coffee className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-amber-50">福龍門市</h1>
            <p className="text-amber-200/60 text-xs italic">Coffee Cup System · Prototype</p>
          </div>
        </div>
        
        {/* 只在門市端模式顯示「返回」 */}
        {view === 'store' && (
          <button 
            onClick={handleBackToCustomer}
            className="px-4 py-2 rounded-full bg-black/30 text-amber-200/70 hover:text-amber-100 text-sm transition"
          >
            ← 返回客人端
          </button>
        )}
      </header>
      
      <main className="max-w-md mx-auto px-6 py-4">
        {view === 'customer' ? <CustomerView /> : <StoreView />}
      </main>
      
      <footer className="text-center py-8 text-amber-200/30 text-xs italic">
        Prototype · 福龍門市寄杯系統 · v0.4
      </footer>
    </div>
  )
}

function CustomerView() {
  const totalCups = INITIAL_BALANCE.reduce((sum, item) => sum + item.count, 0)
  
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-800 to-amber-950 rounded-3xl p-7 shadow-2xl">
        <p className="text-amber-200/70 text-xs uppercase tracking-widest italic mb-2">
          Your Coffee Wallet
        </p>
        <h2 className="text-amber-50 text-2xl font-bold mb-1">嗨,小華 👋</h2>
        <p className="text-amber-200/70 text-sm mb-6">您在福龍門市的寄杯</p>
        
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-amber-50 text-6xl font-bold">{totalCups}</span>
          <span className="text-amber-100 text-xl">杯</span>
        </div>
        <p className="text-amber-200/60 text-xs mb-6">總餘額 · 上限 {CUP_LIMIT} 杯</p>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-4 text-left hover:from-amber-500 hover:to-amber-600 transition">
            <ShoppingBag className="w-5 h-5 text-amber-50 mb-2" />
            <div className="text-amber-50 font-medium text-sm mb-0.5">使用寄杯</div>
            <div className="text-amber-100/70 text-xs">點選想喝的</div>
          </button>
          <button className="bg-amber-50 text-amber-900 rounded-2xl p-4 text-left hover:bg-amber-100 transition">
            <ScanLine className="w-5 h-5 text-amber-900 mb-2" />
            <div className="font-medium text-sm mb-0.5">掃 QR 領取</div>
            <div className="text-amber-700/70 text-xs">店員給的 QR</div>
          </button>
        </div>
      </div>
      
      <div className="bg-amber-50 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-amber-900 font-bold text-base">我的寄杯卡</h3>
          <button className="text-amber-700/70 text-xs flex items-center gap-1 hover:text-amber-900">
            歷史紀錄
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        
        <div className="space-y-3">
          {INITIAL_BALANCE.map(item => (
            <CupCard key={item.itemId} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CupCard({ item }) {
  const isInterchangeable = item.interchangeable
  const isHot = item.temp === 'hot'
  const progressPercent = Math.min((item.count / 10) * 100, 100)
  
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
        isInterchangeable 
          ? 'bg-gradient-to-br from-indigo-100 to-purple-100' 
          : 'bg-gradient-to-br from-orange-100 to-rose-100'
      }`}>
        {isInterchangeable ? (
          <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
        ) : (
          <Flame className="w-5 h-5 text-orange-600" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-amber-900 font-bold">{item.name}</span>
          {isInterchangeable ? (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-medium">
              <ArrowLeftRight className="w-2.5 h-2.5" />
              冰熱可選
            </span>
          ) : isHot ? (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-medium">
              熱
            </span>
          ) : null}
        </div>
        
        <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              isInterchangeable 
                ? 'bg-gradient-to-r from-indigo-400 to-purple-500'
                : 'bg-gradient-to-r from-orange-400 to-rose-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-baseline gap-0.5 flex-shrink-0">
        <span className="text-amber-900 font-bold text-2xl">{item.count}</span>
        <span className="text-amber-700 text-xs">杯</span>
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
