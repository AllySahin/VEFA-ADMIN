'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Login sayfasındaysa kontrol etme
    if (pathname === '/login') {
      setIsChecking(false)
      return
    }

    // Token kontrolü
    const token = localStorage.getItem('vefa_admin_token')
    
    if (!token || token !== 'authenticated') {
      // Token yoksa login'e yönlendir
      router.push('/login')
    } else {
      setIsChecking(false)
    }
  }, [pathname, router])

  // Kontrol sırasında loading göster
  if (isChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--primary-anthracite)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.2)',
            borderTop: '4px solid var(--accent-yellow)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Yükleniyor...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}
