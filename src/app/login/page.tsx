'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiLock, FiMail, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basit authentication - production'da backend ile yapılmalı
    if (email === 'admin@vefa.com' && password === 'admin123') {
      // Login başarılı
      localStorage.setItem('vefa_admin_token', 'authenticated')
      localStorage.setItem('vefa_admin_user', JSON.stringify({
        email,
        name: 'Admin User',
        role: 'admin'
      }))
      
      setTimeout(() => {
        router.push('/admin')
      }, 500)
    } else {
      setError('Email veya şifre hatalı!')
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary-anthracite) 0%, #1a252f 100%)',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--primary-anthracite)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--accent-yellow)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'var(--primary-anthracite)'
          }}>
            V
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.75rem', 
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            VEFA Admin Panel
          </h1>
          <p style={{ 
            margin: 0, 
            opacity: 0.9,
            fontSize: '0.95rem'
          }}>
            Yönetim paneline giriş yapın
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2.5rem 2rem' }}>
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#333'
            }}>
              Email Adresi
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }}>
                <FiMail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vefa.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-anthracite)'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#333'
            }}>
              Şifre
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }}>
                <FiLock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 3rem 0.75rem 3rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-anthracite)'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6c757d',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              background: isLoading ? '#6c757d' : 'var(--primary-anthracite)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#1a252f'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'var(--primary-anthracite)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            {isLoading ? (
              <>⏳ Giriş yapılıyor...</>
            ) : (
              <>
                <FiLogIn size={20} />
                Giriş Yap
              </>
            )}
          </button>

          {/* Demo Info */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: '#6c757d'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              🔐 Demo Giriş Bilgileri
            </div>
            <div><strong>Email:</strong> admin@vefa.com</div>
            <div><strong>Şifre:</strong> admin123</div>
          </div>
        </form>
      </div>
    </div>
  )
}
