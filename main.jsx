import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import liff from '@line/liff'
import App from './App.jsx'

const LIFF_ID = '2010053746-bGpYovSp'

function Root() {
  const [liffProfile, setLiffProfile] = useState(null)
  const [liffReady, setLiffReady] = useState(false)
  
  useEffect(() => {
    // 初始化 LIFF
    liff.init({ liffId: LIFF_ID })
      .then(() => {
        if (liff.isLoggedIn()) {
          return liff.getProfile()
        } else if (liff.isInClient()) {
          // 在 LINE App 內但沒登入,觸發登入
          liff.login()
          return null
        }
        // 不在 LINE 內,demo 模式
        return null
      })
      .then(profile => {
        if (profile) {
          console.log('✓ LIFF 身份:', profile.displayName, profile.userId)
          setLiffProfile({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
          })
        }
        setLiffReady(true)
      })
      .catch(err => {
        console.warn('LIFF 初始化失敗(非致命):', err.message)
        setLiffReady(true) // 即使失敗也讓 App 跑起來,進 demo 模式
      })
  }, [])
  
  // LIFF 還沒準備好之前不顯示 App,避免畫面閃動
  if (!liffReady) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#2A1810',
        color: '#B8804F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: '-apple-system, system-ui, sans-serif'
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: '3px solid rgba(184,128,79,0.2)',
          borderTopColor: '#B8804F',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: 16
        }} />
        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#FBF8F2' }}>☕ 福龍門市寄杯系統</div>
        <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>第一次載入需要幾秒鐘…</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }
  
  return <App liffProfile={liffProfile} />
}

createRoot(document.getElementById('root')).render(<Root />)
