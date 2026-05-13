import React, { useState, useRef } from 'react'
import { 
  Coffee, ArrowLeftRight, Flame, ChevronRight, ChevronLeft,
  ShoppingBag, ScanLine, Plus, Minus, Clock, CheckCircle2
} from 'lucide-react'

// ============ 模擬資料 ============
const INITIAL_BALANCE = [
  { itemId: 'americano', name: '美式咖啡', count: 8, interchangeable: true, allowedTemps: ['hot', 'cold'] },
  { itemId: 'latte', name: '拿鐵', count: 5, interchangeable: true, allowedTemps: ['hot', 'cold'] },
  { itemId: 'mocha', name: '摩卡', count: 3, temp: 'hot' },
]

const CUP_LIMIT = 60

const TEMP_LABEL = { hot: '熱', cold: '冰' }
const TEMP_STYLE = {
  hot: 'bg-orange-100 text-orange-700',
  cold: 'bg-blue-100 text-blue-700'
}

export default function App() {
  const [view, setView] = useState('customer')
  const [storeUnlocked, setStoreUnlocked] = useState(false)
  
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef(null)
  
  function handleLogoClick() {
    clickCountRef.current += 1
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0 }, 1500)
    
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      setStoreUnlocked(true)
      setView('store')
    }
  }
  
  return (
    <div className="min-h-screen bg-[#2A1810] text-amber-50">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoClick}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
            <Coffee className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-amber-50">福龍門市</h1>
            <p className="text-amber-200/60 text-xs italic">Coffee Cup System · Prototype</p>
          </div>
        </div>
        {view === 'store' && (
          <button onClick={() => setView('customer')} className="px-4 py-2 rounded-full bg-black/30 text-amber-200/70 hover:text-amber-100 text-sm transition">
            ← 返回客人端
          </button>
        )}
      </header>
      
      <main className="max-w-md mx-auto px-6 py-4">
        {view === 'customer' ? <CustomerView /> : <StoreView />}
      </main>
      
      <footer className="text-center py-8 text-amber-200/30 text-xs italic">
        Prototype · 福龍門市寄杯系統 · v0.5
      </footer>
    </div>
  )
}

// ============ 客人端:多頁面導航 ============
function CustomerView() {
  const [page, setPage] = useState('home') // home | use | order
  const [balance, setBalance] = useState(INITIAL_BALANCE)
  const [pendingOrder, setPendingOrder] = useState(null)
  
  function handleSubmitOrder(selectedItems) {
    // 模擬下訂單:從寄杯扣除 + 產生訂單編號
    const orderNumber = 'A' + String(Math.floor(Math.random() * 900) + 100)
    setPendingOrder({
      orderNumber,
      items: selectedItems,
      createdAt: Date.now()
    })
    
    // 從 balance 扣除杯數
    const newBalance = balance.map(b => {
      const usedFromThis = selectedItems
        .filter(s => s.itemId === b.itemId)
        .reduce((sum, s) => sum + s.qty, 0)
      return { ...b, count: b.count - usedFromThis }
    })
    setBalance(newBalance)
    setPage('order')
  }
  
  function handleClearOrder() {
    setPendingOrder(null)
    setPage('home')
  }
  
  if (page === 'use') {
    return <CustomerUse balance={balance} onBack={() => setPage('home')} onSubmit={handleSubmitOrder} />
  }
  if (page === 'order' && pendingOrder) {
    return <CustomerOrder order={pendingOrder} onDone={handleClearOrder} />
  }
  return <CustomerHome balance={balance} onUse={() => setPage('use')} pendingOrder={pendingOrder} onViewOrder={() => setPage('order')} />
}

// ============ 客人首頁 ============
function CustomerHome({ balance, onUse, pendingOrder, onViewOrder }) {
  const totalCups = balance.reduce((sum, item) => sum + item.count, 0)
  
  return (
    <div className="space-y-4">
      {/* 進行中訂單橫幅 */}
      {pendingOrder && (
        <button onClick={onViewOrder} className="w-full bg-green-700 hover:bg-green-600 rounded-2xl p-4 flex items-center justify-between transition">
          <div className="text-left">
            <div className="text-green-100 text-xs mb-0.5">您有訂單進行中</div>
            <div className="text-white font-medium">#{pendingOrder.orderNumber} · 點此查看</div>
          </div>
          <ChevronRight className="w-5 h-5 text-green-100" />
        </button>
      )}
      
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
          <button onClick={onUse} className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-4 text-left hover:from-amber-500 hover:to-amber-600 transition">
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
          {balance.map(item => <CupCard key={item.itemId} item={item} />)}
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
        isInterchangeable ? 'bg-gradient-to-br from-indigo-100 to-purple-100' : 'bg-gradient-to-br from-orange-100 to-rose-100'
      }`}>
        {isInterchangeable ? <ArrowLeftRight className="w-5 h-5 text-indigo-600" /> : <Flame className="w-5 h-5 text-orange-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-amber-900 font-bold">{item.name}</span>
          {isInterchangeable ? (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-medium">
              <ArrowLeftRight className="w-2.5 h-2.5" />冰熱可選
            </span>
          ) : isHot ? (
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-medium">熱</span>
          ) : null}
        </div>
        <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full rounded-full ${isInterchangeable ? 'bg-gradient-to-r from-indigo-400 to-purple-500' : 'bg-gradient-to-r from-orange-400 to-rose-500'}`} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <div className="flex-shrink-0">
        <span className="text-amber-900 font-bold text-2xl">{item.count}</span>
        <span className="text-amber-700 text-xs ml-0.5">杯</span>
      </div>
    </div>
  )
}

// ============ 使用寄杯(下訂單)============
function CustomerUse({ balance, onBack, onSubmit }) {
  // selected 的結構:{ 'americano-hot': 2, 'latte-cold': 1, ... }
  const [selected, setSelected] = useState({})
  
  // 算某個 balance 條目目前被選了幾杯(互換品項要把所有溫度加總)
  function getTotalSelectedForBalance(b) {
    if (b.interchangeable) {
      return (b.allowedTemps || ['hot', 'cold']).reduce(
        (sum, t) => sum + (selected[`${b.itemId}-${t}`] || 0), 0
      )
    }
    return selected[`${b.itemId}-${b.temp}`] || 0
  }
  
  function increment(b, temp) {
    const key = `${b.itemId}-${temp}`
    if (getTotalSelectedForBalance(b) < b.count) {
      setSelected({ ...selected, [key]: (selected[key] || 0) + 1 })
    }
  }
  
  function decrement(b, temp) {
    const key = `${b.itemId}-${temp}`
    if ((selected[key] || 0) > 0) {
      setSelected({ ...selected, [key]: selected[key] - 1 })
    }
  }
  
  const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0)
  
  function handleSubmit() {
    if (totalSelected === 0) return
    // 把 selected 轉成清單
    const items = []
    balance.forEach(b => {
      const temps = b.interchangeable ? (b.allowedTemps || ['hot', 'cold']) : [b.temp]
      temps.forEach(t => {
        const qty = selected[`${b.itemId}-${t}`] || 0
        if (qty > 0) {
          items.push({ itemId: b.itemId, name: b.name, temp: t, qty })
        }
      })
    })
    onSubmit(items)
  }
  
  return (
    <div className="bg-amber-50 rounded-3xl p-6 shadow-xl">
      <button onClick={onBack} className="flex items-center gap-1 text-amber-700 mb-4 hover:text-amber-900 transition">
        <ChevronLeft className="w-4 h-4" />返回
      </button>
      
      <h2 className="text-amber-900 font-bold text-xl mb-1">使用寄杯</h2>
      <p className="text-amber-700/70 text-sm mb-6">點 + 選擇想喝的</p>
      
      <div className="space-y-3 mb-6">
        {balance.map(b => {
          const temps = b.interchangeable ? (b.allowedTemps || ['hot', 'cold']) : [b.temp]
          const totalThis = getTotalSelectedForBalance(b)
          const remaining = b.count - totalThis
          
          return (
            <div key={b.itemId} className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-amber-900 font-bold">{b.name}</div>
                  <div className="text-amber-700/70 text-xs">剩 {remaining} 杯可選</div>
                </div>
                {b.interchangeable && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-medium">
                    冰熱可選
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                {temps.map(t => {
                  const qty = selected[`${b.itemId}-${t}`] || 0
                  return (
                    <div key={t} className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${TEMP_STYLE[t]}`}>
                        {TEMP_LABEL[t]}
                      </span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => decrement(b, t)} 
                          disabled={qty === 0}
                          className="w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-amber-900 font-bold">{qty}</span>
                        <button 
                          onClick={() => increment(b, t)} 
                          disabled={remaining === 0}
                          className="w-9 h-9 rounded-full bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      
      <button 
        onClick={handleSubmit}
        disabled={totalSelected === 0}
        className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed text-white rounded-2xl py-4 font-bold transition"
      >
        {totalSelected === 0 ? '請選擇至少 1 杯' : `送出訂單(共 ${totalSelected} 杯)`}
      </button>
    </div>
  )
}

// ============ 訂單追蹤 ============
function CustomerOrder({ order, onDone }) {
  return (
    <div className="bg-amber-50 rounded-3xl p-6 shadow-xl text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      
      <h2 className="text-amber-900 font-bold text-2xl mb-1">訂單已送出</h2>
      <p className="text-amber-700/70 text-sm mb-1">訂單編號</p>
      <p className="text-amber-900 font-bold text-3xl mb-6">#{order.orderNumber}</p>
      
      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="text-xs text-amber-700/70 uppercase tracking-wider mb-3">訂購內容</div>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-amber-900">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${TEMP_STYLE[item.temp]}`}>
                  {TEMP_LABEL[item.temp]}
                </span>
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="text-amber-700 text-sm">× {item.qty}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-left">
        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div className="text-blue-900 text-sm">
          請至福龍門市取杯,店員會通知您
        </div>
      </div>
      
      <button 
        onClick={onDone}
        className="w-full bg-amber-700 hover:bg-amber-800 text-white rounded-2xl py-3 font-medium transition"
      >
        返回首頁
      </button>
    </div>
  )
}

// ============ 門市端(待搬移)============
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
