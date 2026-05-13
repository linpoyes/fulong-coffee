import React, { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div style={{ 
      background: '#2A1810', 
      minHeight: '100vh', 
      color: '#FBF8F2', 
      padding: '40px 20px',
      fontFamily: '-apple-system, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, marginBottom: 8, color: '#B8804F' }}>
          ☕ 福龍門市寄杯系統
        </h1>
        <p style={{ opacity: 0.6, fontSize: 14, marginBottom: 32 }}>
          Vercel + GitHub 部署測試
        </p>
        
        <div style={{ 
          background: 'rgba(184, 128, 79, 0.1)', 
          border: '1px solid rgba(184, 128, 79, 0.3)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20
        }}>
          <p style={{ marginBottom: 12 }}>✅ React 載入成功</p>
          <p style={{ marginBottom: 12 }}>✅ Vite 編譯成功</p>
          <p style={{ marginBottom: 12 }}>✅ Vercel 部署成功</p>
          <p style={{ opacity: 0.6, fontSize: 13 }}>
            接下來會把完整原型(寄杯卡 / 訂單 / 門市端等)搬進來
          </p>
        </div>
        
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            background: 'linear-gradient(135deg, #B8804F, #8B5A2B)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 24,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          點我測試互動 (已點 {count} 次)
        </button>
      </div>
    </div>
  )
}
