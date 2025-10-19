'use client'

import AdminLayout from '../components/AdminLayout'
import { 
  FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp,
  FiArrowUp, FiArrowDown 
} from 'react-icons/fi'

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Toplam Öğrenci',
      value: '1,247',
      trend: { value: '+12%', up: true },
      icon: <FiUsers />,
      color: 'primary'
    },
    {
      label: 'Aktif Kurslar',
      value: '24',
      trend: { value: '+3', up: true },
      icon: <FiBookOpen />,
      color: 'success'
    },
    {
      label: 'Aylık Gelir',
      value: '₺125,400',
      trend: { value: '+8%', up: true },
      icon: <FiDollarSign />,
      color: 'warning'
    },
    {
      label: 'Yeni Kayıtlar',
      value: '48',
      trend: { value: '-2', up: false },
      icon: <FiTrendingUp />,
      color: 'danger'
    }
  ]

  const recentStudents = [
    { id: 1, name: 'Ahmet Yılmaz', course: 'Forklift Operatörlüğü', date: '2025-10-08', status: 'active' },
    { id: 2, name: 'Fatma Demir', course: 'Vinç Operatörlüğü', date: '2025-10-07', status: 'active' },
    { id: 3, name: 'Mehmet Kaya', course: 'Ekskavatör Eğitimi', date: '2025-10-06', status: 'pending' },
    { id: 4, name: 'Ayşe Yıldız', course: 'Manlift Eğitimi', date: '2025-10-05', status: 'active' },
    { id: 5, name: 'Ali Öztürk', course: 'Beko Loder', date: '2025-10-04', status: 'completed' },
  ]

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: 'badge-success',
      pending: 'badge-warning',
      completed: 'badge-info',
    }
    const labels: Record<string, string> = {
      active: 'Aktif',
      pending: 'Beklemede',
      completed: 'Tamamlandı',
    }
    return { class: badges[status], label: labels[status] }
  }

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-trend ${stat.trend.up ? 'up' : 'down'}`}>
                {stat.trend.up ? <FiArrowUp /> : <FiArrowDown />}
                {stat.trend.value} bu ayda
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Students Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Son Kayıtlar</h2>
          <a href="/admin/students" className="btn btn-primary btn-sm">
            Tümünü Gör
          </a>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Öğrenci Adı</th>
                  <th>Kurs</th>
                  <th>Kayıt Tarihi</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => {
                  const statusBadge = getStatusBadge(student.status)
                  return (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td>{student.course}</td>
                      <td className="text-muted">{student.date}</td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-secondary btn-sm">Düzenle</button>
                          <button className="btn btn-primary btn-sm">Detay</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
