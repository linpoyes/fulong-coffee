import React, { useState, useEffect, useRef } from 'react'
import { 
  Coffee, ArrowLeftRight, Flame, ChevronRight, ChevronLeft,
  ShoppingBag, ScanLine, Plus, Minus, Clock, CheckCircle2,
  Gift, Sparkles, FileText, Calendar, TrendingDown, TrendingUp,
  LogOut, User, Award, Settings, Bell, AlertCircle, UserPlus,
  QrCode
} from 'lucide-react'

// ============ 共用資料 ============
const CUP_LIMIT = 60
const TEMP_LABEL = { hot: '熱', cold: '冰' }
const TEMP_STYLE = {
  hot: 'bg-orange-100 text-orange-700',
  cold: 'bg-blue-100 text-blue-700'
}

// ============ 客人端初始資料 ============
const INITIAL_BALANCE = [
  { itemId: 'americano', name: '美式咖啡', count: 8, interchangeable: true, allowedTemps: ['hot', 'cold'] },
  { itemId: 'latte', name: '拿鐵', count: 5, interchangeable: true, allowedTemps: ['hot', 'cold'] },
  { itemId: 'mocha', name: '摩卡', count: 3, temp: 'hot' },
]

const SAMPLE_QR_DATA = [
  { itemId: 'cappuccino', name: '卡布奇諾', qty: 2, temp: 'hot', interchangeable: false, grantedBy: '小芬' },
  { itemId: 'caramel', name: '焦糖瑪奇朵', qty: 3, interchangeable: true, allowedTemps: ['hot', 'cold'], grantedBy: '阿宏' },
  { itemId: 'americano', name: '美式咖啡', qty: 5, interchangeable: true, allowedTemps: ['hot', 'cold'], grantedBy: '老闆 · 彥' },
]

const INITIAL_HISTORY = [
  { type: 'order', orderNumber: 'A038', items: [{ name: '拿鐵', temp: 'cold', qty: 1 }], timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2 },
  { type: 'grant', grantedBy: '老闆 · 彥', name: '拿鐵', qty: 10, interchangeable: true, timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5 },
  { type: 'order', orderNumber: 'A024', items: [{ name: '美式咖啡', temp: 'hot', qty: 1 }, { name: '摩卡', temp: 'hot', qty: 1 }], timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10 },
  { type: 'grant', grantedBy: '小芬', name: '美式咖啡', qty: 10, interchangeable: true, timestamp: Date.now() - 1000 * 60 * 60 * 24 * 14 },
  { type: 'grant', grantedBy: '阿宏', name: '摩卡', qty: 5, temp: 'hot', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 20 },
]

// ============ 門市端初始資料 ============
const INITIAL_ACCOUNTS = [
  { id: 'acc_owner', label: '老闆帳號', username: '72839168', password: 'bwsrac0221', role: 'owner' },
  { id: 'acc_partner', label: '門市端帳號', username: '259002', password: '72839168', role: 'partner' },
]

const INITIAL_HANDLERS = [
  { id: 'h_owner', name: '彥', isOwner: true },
  { id: 'h1', name: '小芬' },
  { id: 'h2', name: '阿宏' },
]

const INITIAL_ITEMS_FULL = [
  { id: 'americano', name: '美式咖啡', temps: ['hot', 'cold'], interchangeable: true },
  { id: 'latte', name: '拿鐵', temps: ['hot', 'cold'], interchangeable: true },
  { id: 'cappuccino', name: '卡布奇諾', temps: ['hot'], interchangeable: false },
  { id: 'mocha', name: '摩卡', temps: ['hot'], interchangeable: false },
  { id: 'caramel', name: '焦糖瑪奇朵', temps: ['hot', 'cold'], interchangeable: true },
]

const INITIAL_ORDERS = [
  { 
    id: 'A043', customerName: '陳美麗', minutesAgo: 1, status: 'pending',
    items: [{ name: '卡布奇諾', temp: 'hot', qty: 3 }]
  },
  { 
    id: 'A042', customerName: '李大華', minutesAgo: 5, status: 'preparing',
    items: [
      { name: '美式咖啡', temp: 'cold', qty: 1 }, 
      { name: '摩卡', temp: 'hot', qty: 1 }
    ]
  },
  { 
    id: 'A041', customerName: '王小明', minutesAgo: 12, status: 'ready',
    items: [{ name: '拿鐵', temp: 'hot', qty: 2 }] 
  },
]

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 1000 / 60)
  if (minutes < 1) return '剛剛'
  if (minutes < 60) return `${minutes} 分鐘前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小時前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  return `${months} 個月前`
}

// ============ 主元件 ============
export default function App({ liffProfile }) {
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
      
      <main className={view === 'store' ? "max-w-2xl mx-auto px-6 py-4" : "max-w-md mx-auto px-6 py-4"}>
        {view === 'customer' ? <CustomerView liffProfile={liffProfile} /> : <StoreView />}
      </main>
      
      <footer className="text-center py-8 text-amber-200/30 text-xs italic">
        Prototype · 福龍門市寄杯系統 · v1.2
      </footer>
    </div>
  )
}

// ============ 客人端(沒變動)============
// 後端 API 網址
const API_BASE = 'https://fulong-line-webhook.jerry0928211793.workers.dev'

function CustomerView({ liffProfile }) {
  const [page, setPage] = useState('home')
  const [balance, setBalance] = useState(INITIAL_BALANCE)
  const [pendingOrder, setPendingOrder] = useState(null)
  const [claimData, setClaimData] = useState(null)
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [usingRealData, setUsingRealData] = useState(false)
  
  // 從後端讀取真實寄杯資料
  useEffect(() => {
    if (!liffProfile?.userId) return // demo 模式不抓
    
    setLoading(true)
    fetch(`${API_BASE}/api/customer/${liffProfile.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.found && data.balance) {
          // 把後端 balance 格式轉成 React 需要的格式
          setBalance(data.balance)
          setUsingRealData(true)
          console.log('✓ 載入真實寄杯資料:', data.balance.length, '筆')
        } else {
          console.log('ℹ️ 後端沒找到該客人,使用展示資料')
        }
        setLoading(false)
      })
      .catch(err => {
        console.warn('API 呼叫失敗(非致命):', err.message)
        setApiError(err.message)
        setLoading(false)
      })
  }, [liffProfile])
  
  function handleSubmitOrder(selectedItems) {
    const orderNumber = 'A' + String(Math.floor(Math.random() * 900) + 100)
    setPendingOrder({ orderNumber, items: selectedItems, createdAt: Date.now() })
    const newBalance = balance.map(b => {
      const usedFromThis = selectedItems.filter(s => s.itemId === b.itemId).reduce((sum, s) => sum + s.qty, 0)
      return { ...b, count: b.count - usedFromThis }
    })
    setBalance(newBalance)
    setHistory([{ type: 'order', orderNumber, items: selectedItems, timestamp: Date.now() }, ...history])
    setPage('order')
  }
  
  function handleClearOrder() {
    setPendingOrder(null)
    setPage('home')
  }
  
  function handleScanSuccess(qrData) {
    setClaimData(qrData)
    setPage('claim')
  }
  
  function handleConfirmClaim() {
    if (!claimData) return
    const existing = balance.find(b => b.itemId === claimData.itemId)
    let newBalance
    if (existing) {
      newBalance = balance.map(b => b.itemId === claimData.itemId ? { ...b, count: b.count + claimData.qty } : b)
    } else {
      newBalance = [...balance, { itemId: claimData.itemId, name: claimData.name, count: claimData.qty, interchangeable: claimData.interchangeable, allowedTemps: claimData.allowedTemps, temp: claimData.temp }]
    }
    setBalance(newBalance)
    setHistory([{ type: 'grant', grantedBy: claimData.grantedBy, name: claimData.name, qty: claimData.qty, interchangeable: claimData.interchangeable, temp: claimData.temp, timestamp: Date.now() }, ...history])
    setClaimData(null)
    setPage('home')
  }
  
  if (page === 'use') return <CustomerUse balance={balance} onBack={() => setPage('home')} onSubmit={handleSubmitOrder} />
  if (page === 'order' && pendingOrder) return <CustomerOrder order={pendingOrder} onDone={handleClearOrder} />
  if (page === 'scan') return <CustomerScan onBack={() => setPage('home')} onSuccess={handleScanSuccess} />
  if (page === 'claim' && claimData) return <CustomerClaim claimData={claimData} onBack={() => setPage('home')} onConfirm={handleConfirmClaim} />
  if (page === 'history') return <CustomerHistory history={history} onBack={() => setPage('home')} />
  return <CustomerHome liffProfile={liffProfile} balance={balance} loading={loading} usingRealData={usingRealData} onUse={() => setPage('use')} onScan={() => setPage('scan')} onHistory={() => setPage('history')} pendingOrder={pendingOrder} onViewOrder={() => setPage('order')} />
}

function CustomerHome({ liffProfile, balance, loading, usingRealData, onUse, onScan, onHistory, pendingOrder, onViewOrder }) {
  const totalCups = balance.reduce((sum, item) => sum + item.count, 0)
  const visibleBalance = balance.filter(b => b.count > 0)
  const displayName = liffProfile?.displayName || '小華'
  const isDemoMode = !liffProfile
  return (
    <div className="space-y-4">
      {loading && (
        <div className="bg-amber-700/30 text-amber-100 text-sm px-4 py-2 rounded-xl text-center">
          載入您的寄杯資料中…
        </div>
      )}
      {usingRealData && !loading && (
        <div className="bg-green-700/30 text-green-100 text-xs px-4 py-1.5 rounded-full text-center">
          ✓ 顯示真實資料(從 Supabase)
        </div>
      )}
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
        <p className="text-amber-200/70 text-xs uppercase tracking-widest italic mb-2">Your Coffee Wallet</p>
        <h2 className="text-amber-50 text-2xl font-bold mb-1">嗨,{displayName} 👋</h2>
        <p className="text-amber-200/70 text-sm mb-6">
          您在福龍門市的寄杯{isDemoMode && <span className="opacity-50">(展示模式)</span>}
        </p>
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
          <button onClick={onScan} className="bg-amber-50 text-amber-900 rounded-2xl p-4 text-left hover:bg-amber-100 transition">
            <ScanLine className="w-5 h-5 text-amber-900 mb-2" />
            <div className="font-medium text-sm mb-0.5">掃 QR 領取</div>
            <div className="text-amber-700/70 text-xs">店員給的 QR</div>
          </button>
        </div>
      </div>
      <div className="bg-amber-50 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-amber-900 font-bold text-base">我的寄杯卡</h3>
          <button onClick={onHistory} className="text-amber-700/70 text-xs flex items-center gap-1 hover:text-amber-900 transition">
            歷史紀錄<ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {visibleBalance.length === 0 ? (
          <div className="text-center py-8">
            <Coffee className="w-10 h-10 text-amber-300 mx-auto mb-2" />
            <p className="text-amber-700/70 text-sm">目前沒有寄杯</p>
            <p className="text-amber-600/50 text-xs mt-1">下次到福龍門市買咖啡時可以寄存</p>
          </div>
        ) : (
          <div className="space-y-3">{visibleBalance.map(item => <CupCard key={item.itemId} item={item} />)}</div>
        )}
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
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isInterchangeable ? 'bg-gradient-to-br from-indigo-100 to-purple-100' : 'bg-gradient-to-br from-orange-100 to-rose-100'}`}>
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

function CustomerUse({ balance, onBack, onSubmit }) {
  const [selected, setSelected] = useState({})
  const visibleBalance = balance.filter(b => b.count > 0)
  function getTotalSelectedForBalance(b) {
    if (b.interchangeable) return (b.allowedTemps || ['hot', 'cold']).reduce((sum, t) => sum + (selected[`${b.itemId}-${t}`] || 0), 0)
    return selected[`${b.itemId}-${b.temp}`] || 0
  }
  function increment(b, temp) {
    const key = `${b.itemId}-${temp}`
    if (getTotalSelectedForBalance(b) < b.count) setSelected({ ...selected, [key]: (selected[key] || 0) + 1 })
  }
  function decrement(b, temp) {
    const key = `${b.itemId}-${temp}`
    if ((selected[key] || 0) > 0) setSelected({ ...selected, [key]: selected[key] - 1 })
  }
  const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0)
  function handleSubmit() {
    if (totalSelected === 0) return
    const items = []
    balance.forEach(b => {
      const temps = b.interchangeable ? (b.allowedTemps || ['hot', 'cold']) : [b.temp]
      temps.forEach(t => {
        const qty = selected[`${b.itemId}-${t}`] || 0
        if (qty > 0) items.push({ itemId: b.itemId, name: b.name, temp: t, qty })
      })
    })
    onSubmit(items)
  }
  return (
    <div className="bg-amber-50 rounded-3xl p-6 shadow-xl">
      <button onClick={onBack} className="flex items-center gap-1 text-amber-700 mb-4 hover:text-amber-900 transition"><ChevronLeft className="w-4 h-4" />返回</button>
      <h2 className="text-amber-900 font-bold text-xl mb-1">使用寄杯</h2>
      <p className="text-amber-700/70 text-sm mb-6">點 + 選擇想喝的</p>
      <div className="space-y-3 mb-6">
        {visibleBalance.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Coffee className="w-10 h-10 text-amber-300 mx-auto mb-2" />
            <p className="text-amber-700/70 text-sm">目前沒有寄杯可使用</p>
          </div>
        ) : visibleBalance.map(b => {
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
                {b.interchangeable && <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-medium">冰熱可選</span>}
              </div>
              <div className="space-y-2">
                {temps.map(t => {
                  const qty = selected[`${b.itemId}-${t}`] || 0
                  return (
                    <div key={t} className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${TEMP_STYLE[t]}`}>{TEMP_LABEL[t]}</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => decrement(b, t)} disabled={qty === 0} className="w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"><Minus className="w-4 h-4" /></button>
                        <span className="w-6 text-center text-amber-900 font-bold">{qty}</span>
                        <button onClick={() => increment(b, t)} disabled={remaining === 0} className="w-9 h-9 rounded-full bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <button onClick={handleSubmit} disabled={totalSelected === 0} className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed text-white rounded-2xl py-4 font-bold transition">
        {totalSelected === 0 ? '請選擇至少 1 杯' : `送出訂單(共 ${totalSelected} 杯)`}
      </button>
    </div>
  )
}

function CustomerOrder({ order, onDone }) {
  return (
    <div className="bg-amber-50 rounded-3xl p-6 shadow-xl text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4"><CheckCircle2 className="w-12 h-12 text-green-600" /></div>
      <h2 className="text-amber-900 font-bold text-2xl mb-1">訂單已送出</h2>
      <p className="text-amber-700/70 text-sm mb-1">訂單編號</p>
      <p className="text-amber-900 font-bold text-3xl mb-6">#{order.orderNumber}</p>
      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="text-xs text-amber-700/70 uppercase tracking-wider mb-3">訂購內容</div>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-amber-900">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${TEMP_STYLE[item.temp]}`}>{TEMP_LABEL[item.temp]}</span>
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="text-amber-700 text-sm">× {item.qty}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-left">
        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div className="text-blue-900 text-sm">請至福龍門市取杯,店員會通知您</div>
      </div>
      <button onClick={onDone} className="w-full bg-amber-700 hover:bg-amber-800 text-white rounded-2xl py-3 font-medium transition">返回首頁</button>
    </div>
  )
}

function CustomerScan({ onBack, onSuccess }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const sample = SAMPLE_QR_DATA[Math.floor(Math.random() * SAMPLE_QR_DATA.length)]
      onSuccess(sample)
    }, 2800)
    return () => clearTimeout(timer)
  }, [onSuccess])
  return (
    <div className="bg-amber-50 rounded-3xl p-6 shadow-xl">
      <button onClick={onBack} className="flex items-center gap-1 text-amber-700 mb-4 hover:text-amber-900 transition"><ChevronLeft className="w-4 h-4" />返回</button>
      <h2 className="text-amber-900 font-bold text-xl mb-1">掃 QR 領取</h2>
      <p className="text-amber-700/70 text-sm mb-6">請對準店員手機上的 QR 碼</p>
      <div className="relative bg-black rounded-3xl aspect-square overflow-hidden mb-6">
        <div className="absolute inset-8 border-2 border-amber-400/60 rounded-2xl">
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-2xl" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-2xl" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-2xl" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-2xl" />
        </div>
        <div className="absolute inset-x-8 h-0.5 bg-amber-400 shadow-[0_0_20px_#fbbf24] animate-scan-line" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <ScanLine className="w-12 h-12 text-amber-300/40" />
          <p className="text-amber-300/70 text-sm mt-4">正在尋找 QR 碼…</p>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-left">
        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-blue-900 text-xs">
          <div className="font-medium mb-1">展示模式</div>
          <div className="opacity-80">3 秒後自動模擬掃到一個 QR 碼,實際上線會接相機 + QR 解碼。</div>
        </div>
      </div>
      <style>{`@keyframes scan-line { 0%, 100% { transform: translateY(2rem); } 50% { transform: translateY(calc(100% - 2.5rem)); } } .animate-scan-line { animation: scan-line 2s ease-in-out infinite; }`}</style>
    </div>
  )
}

function CustomerClaim({ claimData, onBack, onConfirm }) {
  const isInterchangeable = claimData.interchangeable
  const isHot = claimData.temp === 'hot'
  return (
    <div className="bg-amber-50 rounded-3xl p-6 shadow-xl text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center mb-4 shadow-lg"><Gift className="w-12 h-12 text-amber-800" /></div>
      <h2 className="text-amber-900 font-bold text-2xl mb-1">收到一份寄杯!</h2>
      <p className="text-amber-700/70 text-sm mb-6">由 <strong>{claimData.grantedBy}</strong> 發放</p>
      <div className="bg-white rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-amber-900 font-bold text-xl">{claimData.name}</span>
          {isInterchangeable ? (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-medium"><ArrowLeftRight className="w-2.5 h-2.5" />冰熱可選</span>
          ) : isHot ? (
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-medium">熱</span>
          ) : null}
        </div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-amber-700 text-sm">數量</span>
          <span className="text-amber-900 font-bold text-5xl">{claimData.qty}</span>
          <span className="text-amber-900 text-xl">杯</span>
        </div>
      </div>
      <div className="bg-amber-100 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
        <div className="text-xs text-amber-700 uppercase tracking-wider mb-1">確認後</div>
        <div className="text-amber-900 text-sm">這 {claimData.qty} 杯會加入您的寄杯卡,可以慢慢喝 ☕</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onBack} className="bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl py-3 font-medium transition">取消</button>
        <button onClick={onConfirm} className="bg-amber-700 hover:bg-amber-800 text-white rounded-2xl py-3 font-medium transition">確認領取</button>
      </div>
    </div>
  )
}

function CustomerHistory({ history, onBack }) {
  const totalOrders = history.filter(h => h.type === 'order').length
  const totalGrants = history.filter(h => h.type === 'grant').length
  const totalUsed = history.filter(h => h.type === 'order').reduce((sum, h) => sum + h.items.reduce((s, i) => s + i.qty, 0), 0)
  const totalReceived = history.filter(h => h.type === 'grant').reduce((sum, h) => sum + h.qty, 0)
  return (
    <div className="bg-amber-50 rounded-3xl p-6 shadow-xl">
      <button onClick={onBack} className="flex items-center gap-1 text-amber-700 mb-4 hover:text-amber-900 transition"><ChevronLeft className="w-4 h-4" />返回</button>
      <h2 className="text-amber-900 font-bold text-xl mb-1">歷史紀錄</h2>
      <p className="text-amber-700/70 text-sm mb-6">您的寄杯活動</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-green-700" /><span className="text-green-800 text-xs font-medium">收到</span></div>
          <div className="flex items-baseline gap-1"><span className="text-green-900 font-bold text-2xl">{totalReceived}</span><span className="text-green-700 text-xs">杯</span></div>
          <div className="text-green-700/70 text-xs mt-0.5">{totalGrants} 次發放</div>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingDown className="w-4 h-4 text-rose-700" /><span className="text-rose-800 text-xs font-medium">已用</span></div>
          <div className="flex items-baseline gap-1"><span className="text-rose-900 font-bold text-2xl">{totalUsed}</span><span className="text-rose-700 text-xs">杯</span></div>
          <div className="text-rose-700/70 text-xs mt-0.5">{totalOrders} 筆訂單</div>
        </div>
      </div>
      {history.length === 0 ? (
        <div className="bg-amber-100 rounded-2xl p-8 text-center text-amber-700/70 text-sm">目前沒有紀錄</div>
      ) : (
        <div className="space-y-3">{history.map((entry, i) => <HistoryEntry key={i} entry={entry} />)}</div>
      )}
    </div>
  )
}

function HistoryEntry({ entry }) {
  if (entry.type === 'grant') {
    const isInterchangeable = entry.interchangeable
    const isHot = entry.temp === 'hot'
    return (
      <div className="bg-white rounded-2xl p-4 border-l-4 border-green-400">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><Gift className="w-4 h-4 text-green-700" /></div>
            <div>
              <div className="text-amber-900 font-medium text-sm">收到寄杯</div>
              <div className="text-amber-700/60 text-xs">由 {entry.grantedBy} 發放</div>
            </div>
          </div>
          <div className="text-amber-700/60 text-xs">{formatTimeAgo(entry.timestamp)}</div>
        </div>
        <div className="flex items-center justify-between pl-10">
          <div className="flex items-center gap-2">
            <span className="text-amber-900 font-medium text-sm">{entry.name}</span>
            {isInterchangeable ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px]"><ArrowLeftRight className="w-2 h-2" />冰熱可選</span>
            ) : isHot ? (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px]">熱</span>
            ) : null}
          </div>
          <span className="text-green-700 font-bold text-sm">+ {entry.qty} 杯</span>
        </div>
      </div>
    )
  }
  const totalQty = entry.items.reduce((sum, i) => sum + i.qty, 0)
  return (
    <div className="bg-white rounded-2xl p-4 border-l-4 border-rose-400">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0"><ShoppingBag className="w-4 h-4 text-rose-700" /></div>
          <div>
            <div className="text-amber-900 font-medium text-sm">使用寄杯</div>
            <div className="text-amber-700/60 text-xs">訂單 #{entry.orderNumber}</div>
          </div>
        </div>
        <div className="text-amber-700/60 text-xs">{formatTimeAgo(entry.timestamp)}</div>
      </div>
      <div className="pl-10 space-y-1">
        {entry.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${TEMP_STYLE[item.temp]}`}>{TEMP_LABEL[item.temp]}</span>
              <span className="text-amber-900 text-sm">{item.name}</span>
            </div>
            <span className="text-rose-700 text-sm">× {item.qty}</span>
          </div>
        ))}
        <div className="text-rose-700 font-bold text-sm text-right pt-1">- {totalQty} 杯</div>
      </div>
    </div>
  )
}

// ============ 門市端 ============
function StoreView() {
  const [account, setAccount] = useState(null) // 登入後的帳號
  const [tab, setTab] = useState('orders') // orders | grant | reports | settings
  
  if (!account) {
    return <StoreLogin onLogin={setAccount} />
  }
  
  const isOwner = account.role === 'owner'
  const displayName = isOwner ? '老闆 · 彥' : '門市端'
  
  return (
    <div className="bg-amber-50 rounded-3xl shadow-2xl overflow-hidden">
      {/* 頂部 staff bar */}
      <div className="bg-amber-900 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center">
            {isOwner ? <Award className="w-4 h-4 text-amber-100" /> : <User className="w-4 h-4 text-amber-100" />}
          </div>
          <div>
            <div className="text-amber-50 text-sm font-medium">{displayName}</div>
            <div className="text-amber-200/60 text-xs">{isOwner ? '老闆權限' : '門市權限'}</div>
          </div>
        </div>
        <button onClick={() => setAccount(null)} className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs flex items-center gap-1 transition">
          <LogOut className="w-3.5 h-3.5" />登出
        </button>
      </div>
      
      {/* 分頁切換 */}
      <div className="bg-amber-100 px-2 flex gap-1 overflow-x-auto">
        {[
          { id: 'orders', label: '接單', icon: Bell },
          { id: 'grant', label: '發杯', icon: Gift },
          { id: 'reports', label: '報表', icon: FileText },
          { id: 'settings', label: '設定', icon: Settings },
        ].map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-3 flex items-center gap-1.5 text-sm font-medium border-b-2 transition ${active ? 'border-amber-700 text-amber-900' : 'border-transparent text-amber-700/60 hover:text-amber-900'}`}>
              <Icon className="w-4 h-4" />{t.label}
            </button>
          )
        })}
      </div>
      
      {/* 內容區 */}
      <div className="p-5">
        {tab === 'orders' && <StoreOrders />}
        {tab === 'grant' && <StoreGrant />}
        {tab === 'reports' && <StorePlaceholder title="報表" desc="銷售統計、寄杯狀況、客戶分析" />}
        {tab === 'settings' && <StorePlaceholder title="設定" desc="品項、帳號、經手人、語音、LINE 通知" />}
      </div>
    </div>
  )
}

function StoreLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  
  function tryLogin() {
    const u = username.trim()
    const p = password.trim()
    if (!u || !p) { setError('請輸入帳號和密碼'); return }
    const match = INITIAL_ACCOUNTS.find(a => a.username === u && a.password === p)
    if (match) { setError(''); onLogin(match) }
    else setError('帳號或密碼錯誤')
  }
  
  function fillDemo(account) {
    setUsername(account.username)
    setPassword(account.password)
    setError('')
  }
  
  return (
    <div className="bg-gradient-to-br from-amber-900 to-[#1a0f08] rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center shadow-lg">
          <Coffee className="w-10 h-10 text-amber-100" />
        </div>
        <p className="text-amber-200/60 text-xs uppercase tracking-widest italic mb-1">Staff Access</p>
        <h2 className="text-amber-50 text-2xl font-bold mb-1">福龍門市</h2>
        <p className="text-amber-200/70 text-sm">寄杯系統 · 門市端</p>
      </div>
      
      <div className="space-y-3 mb-3">
        <div>
          <label className="block text-xs text-amber-200/70 mb-1.5">帳號</label>
          <input type="text" value={username}
            onChange={(e) => { setUsername(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && tryLogin()}
            placeholder="請輸入帳號"
            className="w-full px-4 py-3 rounded-xl bg-black/30 text-amber-50 placeholder:text-amber-200/30 outline-none border border-amber-800/50 focus:border-amber-600 transition"
          />
        </div>
        <div>
          <label className="block text-xs text-amber-200/70 mb-1.5">密碼</label>
          <input type="password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && tryLogin()}
            placeholder="請輸入密碼"
            className="w-full px-4 py-3 rounded-xl bg-black/30 text-amber-50 placeholder:text-amber-200/30 outline-none border border-amber-800/50 focus:border-amber-600 transition"
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800/50 rounded-lg px-3 py-2 mb-3 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      
      <button onClick={tryLogin} className="w-full py-3.5 rounded-xl font-bold text-amber-950 bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-50 hover:to-amber-100 transition active:scale-95">
        登入
      </button>
      
      <div className="text-center mt-4">
        <button onClick={() => setShowDemo(!showDemo)} className="text-amber-200/40 text-xs underline">
          {showDemo ? '隱藏示範帳號' : '顯示示範帳號'}
        </button>
      </div>
      
      {showDemo && (
        <div className="mt-3 space-y-2">
          {INITIAL_ACCOUNTS.map(acc => (
            <button key={acc.id} onClick={() => fillDemo(acc)} className="w-full px-3 py-2 rounded-lg bg-black/30 hover:bg-black/40 border border-amber-800/30 text-left transition">
              <div className="font-bold text-amber-200/80 text-xs">{acc.label}</div>
              <div className="text-amber-200/50 text-[10px] font-mono">{acc.username} / {acc.password}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StoreOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  
  function acceptOrder(orderId) {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'preparing' } : o))
  }
  
  function markReady(orderId) {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'ready' } : o))
  }
  
  function completeOrder(orderId) {
    setOrders(orders.filter(o => o.id !== orderId))
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-amber-700" />
        </div>
        <p className="text-amber-900 font-medium mb-1">沒有待處理訂單</p>
        <p className="text-amber-700/60 text-sm">所有訂單已完成 ☕</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-amber-900 font-bold">待處理訂單</h2>
        <span className="text-amber-700 text-sm">{orders.length} 筆</span>
      </div>
      
      {orders.map(order => (
        <OrderCard 
          key={order.id} 
          order={order}
          onAccept={() => acceptOrder(order.id)}
          onMarkReady={() => markReady(order.id)}
          onComplete={() => completeOrder(order.id)}
        />
      ))}
    </div>
  )
}

function OrderCard({ order, onAccept, onMarkReady, onComplete }) {
  const statusConfig = {
    pending: { label: '待處理', color: 'bg-red-100 text-red-700 border-red-200' },
    preparing: { label: '製作中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    ready: { label: '待取', color: 'bg-green-100 text-green-700 border-green-200' },
  }
  const config = statusConfig[order.status]
  
  return (
    <div className={`bg-white rounded-2xl p-4 border-2 ${config.color.split(' ').slice(-1)[0]}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-amber-900 font-bold text-lg">#{order.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
          <div className="text-amber-700/70 text-xs">
            {order.customerName} · {order.minutesAgo} 分鐘前
          </div>
        </div>
      </div>
      
      <div className="space-y-1 mb-3 pl-1">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs ${TEMP_STYLE[item.temp]}`}>{TEMP_LABEL[item.temp]}</span>
              <span className="text-amber-900">{item.name}</span>
            </div>
            <span className="text-amber-700">× {item.qty}</span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        {order.status === 'pending' && (
          <button onClick={onAccept} className="flex-1 bg-amber-700 hover:bg-amber-800 text-white rounded-xl py-2.5 font-medium text-sm transition">
            接單
          </button>
        )}
        {order.status === 'preparing' && (
          <button onClick={onMarkReady} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 font-medium text-sm transition">
            製作完成 · 通知客人
          </button>
        )}
        {order.status === 'ready' && (
          <button onClick={onComplete} className="flex-1 bg-amber-700 hover:bg-amber-800 text-white rounded-xl py-2.5 font-medium text-sm transition">
            銷帳完成
          </button>
        )}
      </div>
    </div>
  )
}

// ============ 門市端 - 發杯 ============
function StoreGrant() {
  // 第一階段:選品項
  // 第二階段:顯示 QR
  const [step, setStep] = useState('pick') // pick | qr
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedTemp, setSelectedTemp] = useState(null)
  const [qty, setQty] = useState(1)
  const [generatedQR, setGeneratedQR] = useState(null)
  
  function pickItem(item) {
    setSelectedItem(item)
    // 預設選第一個溫度
    setSelectedTemp(item.interchangeable ? null : item.temps[0])
  }
  
  function generateQR() {
    if (!selectedItem) return
    const data = {
      itemId: selectedItem.id,
      name: selectedItem.name,
      qty,
      interchangeable: selectedItem.interchangeable,
      allowedTemps: selectedItem.interchangeable ? selectedItem.temps : null,
      temp: selectedItem.interchangeable ? null : selectedTemp,
      grantedBy: '老闆 · 彥', // TODO:之後改成登入帳號
      timestamp: Date.now(),
      // 唯一識別碼,將來後端用來驗證 QR 只能掃一次
      qrId: `Q${Date.now()}${Math.floor(Math.random() * 1000)}`,
    }
    setGeneratedQR(data)
    setStep('qr')
  }
  
  function reset() {
    setStep('pick')
    setSelectedItem(null)
    setSelectedTemp(null)
    setQty(1)
    setGeneratedQR(null)
  }
  
  if (step === 'qr' && generatedQR) {
    return <GrantQRDisplay data={generatedQR} onReset={reset} />
  }
  
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-amber-900 font-bold mb-1">發杯</h2>
        <p className="text-amber-700/60 text-sm">選擇品項與杯數,產生 QR 給客人掃描</p>
      </div>
      
      {/* 品項選擇 */}
      <div>
        <div className="text-xs text-amber-700/70 uppercase tracking-wider mb-2 font-medium">品項</div>
        <div className="grid grid-cols-2 gap-2">
          {INITIAL_ITEMS_FULL.map(item => {
            const isSelected = selectedItem?.id === item.id
            return (
              <button 
                key={item.id} 
                onClick={() => pickItem(item)} 
                className={`p-3 rounded-2xl text-left transition border-2 ${
                  isSelected 
                    ? 'bg-amber-700 text-white border-amber-700' 
                    : 'bg-white text-amber-900 border-transparent hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected 
                      ? 'bg-white/20' 
                      : item.interchangeable ? 'bg-indigo-100' : 'bg-orange-100'
                  }`}>
                    {item.interchangeable ? (
                      <ArrowLeftRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                    ) : (
                      <Flame className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-orange-600'}`} />
                    )}
                  </div>
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <div className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-amber-700/60'}`}>
                  {item.interchangeable ? '冰熱可選' : item.temps.map(t => TEMP_LABEL[t]).join(' / ')}
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* 溫度選擇(只在非冰熱可選時顯示)*/}
      {selectedItem && !selectedItem.interchangeable && selectedItem.temps.length > 1 && (
        <div>
          <div className="text-xs text-amber-700/70 uppercase tracking-wider mb-2 font-medium">溫度</div>
          <div className="flex gap-2">
            {selectedItem.temps.map(t => {
              const isSelected = selectedTemp === t
              return (
                <button 
                  key={t} 
                  onClick={() => setSelectedTemp(t)}
                  className={`flex-1 py-2 rounded-xl font-medium text-sm transition ${
                    isSelected 
                      ? (t === 'hot' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white')
                      : `${TEMP_STYLE[t]} hover:opacity-80`
                  }`}
                >
                  {TEMP_LABEL[t]}
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      {/* 杯數選擇 */}
      {selectedItem && (
        <div>
          <div className="text-xs text-amber-700/70 uppercase tracking-wider mb-2 font-medium">杯數</div>
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
            <button 
              onClick={() => qty > 1 && setQty(qty - 1)} 
              disabled={qty <= 1}
              className="w-12 h-12 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="flex items-baseline gap-1">
              <span className="text-amber-900 font-bold text-4xl">{qty}</span>
              <span className="text-amber-700 text-lg">杯</span>
            </div>
            <button 
              onClick={() => qty < 99 && setQty(qty + 1)} 
              disabled={qty >= 99}
              className="w-12 h-12 rounded-full bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* 產生 QR 按鈕 */}
      <button 
        onClick={generateQR} 
        disabled={!selectedItem}
        className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed text-white rounded-2xl py-4 font-bold transition flex items-center justify-center gap-2"
      >
        <QrCode className="w-5 h-5" />
        產生 QR 碼
      </button>
    </div>
  )
}

// ============ QR 顯示頁(發完後) ============
function GrantQRDisplay({ data, onReset }) {
  const isInterchangeable = data.interchangeable
  const isHot = data.temp === 'hot'
  
  return (
    <div className="text-center">
      <button onClick={onReset} className="flex items-center gap-1 text-amber-700 mb-4 hover:text-amber-900 transition mr-auto">
        <ChevronLeft className="w-4 h-4" />重新選擇
      </button>
      
      <h2 className="text-amber-900 font-bold text-xl mb-1">請客人掃描</h2>
      <p className="text-amber-700/70 text-sm mb-6">客人用 LINE 內的「掃 QR 領取」</p>
      
      {/* 假 QR Code(用 SVG 畫格子)*/}
      <div className="bg-white rounded-3xl p-6 mx-auto inline-block shadow-lg mb-6">
        <FakeQRCode data={data.qrId} />
      </div>
      
      {/* 內容預覽 */}
      <div className="bg-amber-100 rounded-2xl p-4 mb-4">
        <div className="text-xs text-amber-700/70 uppercase tracking-wider mb-2">QR 內容</div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-amber-900 font-bold text-lg">{data.name}</span>
          {isInterchangeable ? (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-medium">
              <ArrowLeftRight className="w-2.5 h-2.5" />冰熱可選
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${TEMP_STYLE[data.temp]}`}>
              {TEMP_LABEL[data.temp]}
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-amber-700 text-sm">數量</span>
          <span className="text-amber-900 font-bold text-3xl">{data.qty}</span>
          <span className="text-amber-700">杯</span>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-blue-900 text-xs">
            <div className="font-medium mb-1">展示模式</div>
            <div className="opacity-80">客人端掃描 QR 碼會自動顯示「收到一份寄杯」確認頁。實際上線後 QR 內容會與後端綁定,確保只能掃一次。</div>
          </div>
        </div>
      </div>
      
      <button onClick={onReset} className="w-full mt-6 bg-amber-700 hover:bg-amber-800 text-white rounded-2xl py-3 font-medium transition">
        完成,發下一張
      </button>
    </div>
  )
}

// 假 QR Code:用 hash 演算法把字串轉成 21x21 點陣圖
function FakeQRCode({ data }) {
  const size = 21
  // 用 data 字串產生「看起來像 QR」的點陣(實際不是真 QR)
  const grid = []
  let seed = 0
  for (let i = 0; i < data.length; i++) seed = (seed * 31 + data.charCodeAt(i)) >>> 0
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      // 3 個定位點(左上、右上、左下角)
      if (
        (x < 7 && y < 7) || // 左上
        (x >= size - 7 && y < 7) || // 右上
        (x < 7 && y >= size - 7) // 左下
      ) {
        // 7x7 定位點:外框實心,中間 3x3 實心
        const lx = x < 7 ? x : (x >= size - 7 ? x - (size - 7) : 0)
        const ly = y < 7 ? y : (y >= size - 7 ? y - (size - 7) : 0)
        const isEdge = lx === 0 || lx === 6 || ly === 0 || ly === 6
        const isCenter = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4
        row.push(isEdge || isCenter ? 1 : 0)
      } else {
        // 用 seed 偽隨機產生點
        seed = (seed * 1103515245 + 12345) >>> 0
        row.push((seed >> ((x + y) % 16)) & 1)
      }
    }
    grid.push(row)
  }
  
  const cellSize = 8
  const totalSize = size * cellSize
  
  return (
    <svg width={totalSize} height={totalSize} viewBox={`0 0 ${totalSize} ${totalSize}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={totalSize} height={totalSize} fill="white" />
      {grid.map((row, y) => 
        row.map((cell, x) => 
          cell ? <rect key={`${x}-${y}`} x={x * cellSize} y={y * cellSize} width={cellSize} height={cellSize} fill="#2A1810" /> : null
        )
      )}
    </svg>
  )
}

function StorePlaceholder({ title, desc }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-amber-700" />
      </div>
      <p className="text-amber-900 font-medium mb-1">{title}</p>
      <p className="text-amber-700/60 text-sm">{desc}</p>
      <p className="text-amber-700/40 text-xs mt-3 italic">即將上線</p>
    </div>
  )
}
