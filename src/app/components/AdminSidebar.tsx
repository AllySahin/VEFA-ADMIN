'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiHome, FiUsers, FiBookOpen, FiImage, FiMessageSquare, 
  FiDollarSign, FiBarChart2, FiSettings, FiChevronLeft,
  FiChevronRight, FiAward, FiMail, FiFileText, FiUserCheck
} from 'react-icons/fi'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: number
}

interface NavSection {
  title: string
  items: NavItem[]
}

export default function AdminSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const navSections: NavSection[] = [
    {
      title: 'Ana Menü',
      items: [
        { title: 'Dashboard', href: '/admin', icon: <FiHome /> },
        { title: 'Öğrenciler', href: '/admin/students', icon: <FiUsers />, badge: 12 },
        { title: 'Kurslar', href: '/admin/courses', icon: <FiBookOpen /> },
      ]
    },
    {
      title: 'İçerik Yönetimi',
      items: [
        { title: 'Slider Yönetimi', href: '/admin/slider', icon: <FiImage /> },
        { title: 'Referanslar', href: '/admin/references', icon: <FiAward /> },
        { title: 'Eğitmenler', href: '/admin/trainers', icon: <FiUserCheck /> },
        { title: 'Yorumlar', href: '/admin/comments', icon: <FiMessageSquare />, badge: 5 },
        { title: 'Mail Gönder', href: '/admin/send-mail', icon: <FiMail /> },
        { title: 'Mail Şablonları', href: '/admin/mail-templates', icon: <FiFileText /> },
      ]
    },
    {
      title: 'Finans & Raporlar',
      items: [
        { title: 'Ödemeler', href: '/admin/payments', icon: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₺</span> },
        { title: 'Raporlar', href: '/admin/reports', icon: <FiBarChart2 /> },
      ]
    },
    {
      title: 'Sistem',
      items: [
        { title: 'Ayarlar', href: '/admin/settings', icon: <FiSettings /> },
      ]
    }
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <a href="/admin" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#FFD600', fontWeight: 500, fontSize: 26, letterSpacing: 1 }}>VEFA EĞİTİM KURUMLARI</span>
          </a>
        </div>
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="nav-section">
            <div className="nav-section-title">{section.title}</div>
            <ul className="nav-items">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="nav-item">
                  <Link 
                    href={item.href}
                    className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.title}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
