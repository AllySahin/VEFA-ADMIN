'use client'

import { usePathname, useRouter } from 'next/navigation'
import { FiSearch, FiBell, FiMail, FiChevronRight, FiLogOut } from 'react-icons/fi'

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

  const getPageTitle = () => {
    const routes: Record<string, string> = {
      '/admin': 'Dashboard',
      '/admin/students': 'Öğrenci Yönetimi',
      '/admin/courses': 'Kurs Yönetimi',
      '/admin/slider': 'Slider Yönetimi',
      '/admin/services': 'Hizmet Yönetimi',
      '/admin/messages': 'Mesajlar',
      '/admin/payments': 'Ödeme Yönetimi',
      '/admin/reports': 'Raporlar',
      '/admin/settings': 'Sistem Ayarları',
      '/admin/notifications': 'Bildirimler',
    }
    return routes[pathname] || 'Admin Panel'
  }

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs = [
      { label: 'Ana Sayfa', href: '/admin' }
    ]

    if (paths.length > 1) {
      breadcrumbs.push({
        label: getPageTitle(),
        href: pathname
      })
    }

    return breadcrumbs
  }

  return (

    <header className="admin-header">
      <div className="header-left"></div>

      <div className="header-right">
        <div className="header-actions">
          <button className="header-btn" title="Mesajlar">
            <FiMail size={20} />
            <span className="notification-badge">3</span>
          </button>

          <button className="header-btn" title="Bildirimler">
            <FiBell size={20} />
            <span className="notification-badge">7</span>
          </button>

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
