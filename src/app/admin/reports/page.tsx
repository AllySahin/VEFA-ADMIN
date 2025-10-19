'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiDownload, FiCalendar, FiTrendingUp, FiTrendingDown, FiUsers, FiBookOpen, FiDollarSign } from 'react-icons/fi'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month')

  const financialData = {
    totalRevenue: 125400,
    monthlyGrowth: 12.5,
    expenses: 45600,
    netProfit: 79800,
  }

  const studentStats = {
    total: 1247,
    active: 856,
    completed: 391,
    newThisMonth: 48,
    growthRate: 8.2,
  }

  const courseStats = [
    { name: 'Forklift Operatörlüğü', students: 324, revenue: 1134000, completion: 89 },
    { name: 'Vinç Operatörlüğü', students: 218, revenue: 915600, completion: 85 },
    { name: 'Ekskavatör Eğitimi', students: 156, revenue: 780000, completion: 92 },
    { name: 'İş Güvenliği', students: 287, revenue: 717500, completion: 78 },
    { name: 'Beko Loder', students: 143, revenue: 643500, completion: 88 },
    { name: 'Manlift Eğitimi', students: 119, revenue: 452200, completion: 91 },
  ]

  const monthlyRevenue = [
    { month: 'Ocak', revenue: 98000 },
    { month: 'Şubat', revenue: 105000 },
    { month: 'Mart', revenue: 112000 },
    { month: 'Nisan', revenue: 118000 },
    { month: 'Mayıs', revenue: 122000 },
    { month: 'Haziran', revenue: 125400 },
  ]

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <select 
          className="form-control"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="week">Bu Hafta</option>
          <option value="month">Bu Ay</option>
          <option value="quarter">Bu Çeyrek</option>
          <option value="year">Bu Yıl</option>
        </select>
      </div>

      {/* Financial Summary */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">
            <FiDollarSign /> Finansal Özet
          </h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="report-stat">
                <div className="report-stat-label">Toplam Gelir</div>
                <div className="report-stat-value">₺{financialData.totalRevenue.toLocaleString()}</div>
                <div className="report-stat-trend up">
                  <FiTrendingUp /> {financialData.monthlyGrowth}% artış
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="report-stat">
                <div className="report-stat-label">Giderler</div>
                <div className="report-stat-value">₺{financialData.expenses.toLocaleString()}</div>
                <div className="report-stat-trend down">
                  <FiTrendingDown /> Geçen aya göre
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="report-stat">
                <div className="report-stat-label">Net Kar</div>
                <div className="report-stat-value success">₺{financialData.netProfit.toLocaleString()}</div>
                <div className="report-stat-trend up">
                  <FiTrendingUp /> Sağlıklı büyüme
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="report-stat">
                <div className="report-stat-label">Kar Marjı</div>
                <div className="report-stat-value">%{((financialData.netProfit / financialData.totalRevenue) * 100).toFixed(1)}</div>
                <div className="report-stat-trend up">
                  <FiTrendingUp /> Hedefin üstünde
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Statistics */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">
            <FiUsers /> Öğrenci İstatistikleri
          </h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="report-stat">
                <div className="report-stat-label">Toplam Öğrenci</div>
                <div className="report-stat-value">{studentStats.total.toLocaleString()}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="report-stat">
                <div className="report-stat-label">Aktif Öğrenci</div>
                <div className="report-stat-value">{studentStats.active.toLocaleString()}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="report-stat">
                <div className="report-stat-label">Bu Ay Yeni</div>
                <div className="report-stat-value">{studentStats.newThisMonth}</div>
                <div className="report-stat-trend up">
                  <FiTrendingUp /> {studentStats.growthRate}% artış
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="report-stat">
                <div className="report-stat-label">Tamamlanan</div>
                <div className="report-stat-value">{studentStats.completed}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Course Performance */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <FiBookOpen /> Kurs Performansı
              </h2>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Kurs Adı</th>
                      <th>Öğrenci</th>
                      <th>Gelir</th>
                      <th>Tamamlanma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseStats.map((course, index) => (
                      <tr key={index}>
                        <td><strong>{course.name}</strong></td>
                        <td>{course.students}</td>
                        <td>₺{course.revenue.toLocaleString()}</td>
                        <td>
                          <div className="progress-container">
                            <div className="progress">
                              <div 
                                className="progress-bar"
                                style={{ width: `${course.completion}%` }}
                              />
                            </div>
                            <span className="progress-text">{course.completion}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <FiCalendar /> Aylık Gelir Trendi
              </h2>
            </div>
            <div className="card-body">
              <div className="revenue-chart">
                {monthlyRevenue.map((item, index) => {
                  const maxRevenue = Math.max(...monthlyRevenue.map(r => r.revenue))
                  const heightPercent = (item.revenue / maxRevenue) * 100
                  
                  return (
                    <div key={index} className="chart-bar">
                      <div 
                        className="bar"
                        style={{ height: `${heightPercent}%` }}
                        title={`₺${item.revenue.toLocaleString()}`}
                      />
                      <div className="chart-label">{item.month}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
