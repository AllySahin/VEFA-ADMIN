'use client'

import { usePathname, useRouter } from 'next/navigation'
import { FiLogOut } from 'react-icons/fi'

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      localStorage.removeItem('vefa_admin_token')
      localStorage.removeItem('vefa_admin_user')
      router.push('/login')
    }
  }

  return (
    <header className="admin-header">
      <div className="header-left"></div>

      <div className="header-right">
        <div className="header-actions">
          <div className="user-menu">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Yönetici</div>
            </div>
          </div>

          <button 
            className="header-btn" 
            title="Çıkış Yap"
            onClick={handleLogout}
            style={{ marginLeft: '0.5rem', color: '#dc3545' }}
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
