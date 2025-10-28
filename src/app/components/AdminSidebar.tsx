'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiHome, FiUsers, FiBookOpen, FiImage, FiMessageSquare, 
  FiDollarSign, FiBarChart2, FiSettings, FiChevronLeft,
  FiChevronRight, FiBell, FiFileText, FiAward, FiMessageCircle
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
        { title: 'Hizmetler', href: '/admin/services', icon: <FiFileText /> },
        { title: 'Mesajlar', href: '/admin/messages', icon: <FiMessageSquare />, badge: 5 },
        { title: 'Yorumlar', href: '/admin/comments', icon: <FiMessageCircle />, badge: 3 },
      ]
    },
    {
      title: 'Finans & Raporlar',
      items: [
        { title: 'Ödemeler', href: '/admin/payments', icon: <FiDollarSign /> },
        { title: 'Raporlar', href: '/admin/reports', icon: <FiBarChart2 /> },
      ]
    },
    {
      title: 'Sistem',
      items: [
        { title: 'Ayarlar', href: '/admin/settings', icon: <FiSettings /> },
        { title: 'Bildirimler', href: '/admin/notifications', icon: <FiBell /> },
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
          <span className="sidebar-logo-text">VEFA</span>
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
