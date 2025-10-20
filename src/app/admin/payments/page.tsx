'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiSearch, FiFilter, FiDownload, FiEye, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi'

interface Payment {
  id: number
  studentName: string
  course: string
  amount: number
  paidAmount: number
  remainingAmount: number
  paymentDate: string
  dueDate: string
  status: 'paid' | 'partial' | 'pending' | 'overdue'
  paymentMethod: 'cash' | 'card' | 'transfer' | 'installment'
  installments?: {
    total: number
    paid: number
  }
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')

  const payments: Payment[] = [
    { id: 1, studentName: 'Ahmet Yılmaz', course: 'Forklift Operatörlüğü', amount: 3500, paidAmount: 3500, remainingAmount: 0, paymentDate: '2025-10-08', dueDate: '2025-10-08', status: 'paid', paymentMethod: 'card' },
    { id: 2, studentName: 'Fatma Demir', course: 'Vinç Operatörlüğü', amount: 4200, paidAmount: 2100, remainingAmount: 2100, paymentDate: '2025-10-07', dueDate: '2025-11-07', status: 'partial', paymentMethod: 'installment', installments: { total: 2, paid: 1 } },
    { id: 3, studentName: 'Mehmet Kaya', course: 'Ekskavatör Eğitimi', amount: 5000, paidAmount: 0, remainingAmount: 5000, paymentDate: '-', dueDate: '2025-10-20', status: 'pending', paymentMethod: 'transfer' },
    { id: 4, studentName: 'Ayşe Yıldız', course: 'Manlift Eğitimi', amount: 3800, paidAmount: 1900, remainingAmount: 1900, paymentDate: '2025-10-05', dueDate: '2025-09-30', status: 'overdue', paymentMethod: 'installment', installments: { total: 2, paid: 1 } },
    { id: 5, studentName: 'Ali Öztürk', course: 'Beko Loder', amount: 4500, paidAmount: 4500, remainingAmount: 0, paymentDate: '2025-10-04', dueDate: '2025-10-04', status: 'paid', paymentMethod: 'cash' },
    { id: 6, studentName: 'Zeynep Şahin', course: 'Forklift Operatörlüğü', amount: 3500, paidAmount: 1166, remainingAmount: 2334, paymentDate: '2025-10-03', dueDate: '2025-11-03', status: 'partial', paymentMethod: 'installment', installments: { total: 3, paid: 1 } },
    { id: 7, studentName: 'Can Arslan', course: 'Vinç Operatörlüğü', amount: 4200, paidAmount: 0, remainingAmount: 4200, paymentDate: '-', dueDate: '2025-09-25', status: 'overdue', paymentMethod: 'transfer' },
    { id: 8, studentName: 'Elif Koç', course: 'İş Güvenliği', amount: 2500, paidAmount: 2500, remainingAmount: 0, paymentDate: '2025-10-01', dueDate: '2025-10-01', status: 'paid', paymentMethod: 'card' },
  ]

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string; icon: React.ReactNode }> = {
      paid: { class: 'badge-success', label: 'Ödendi', icon: <FiCheckCircle /> },
      partial: { class: 'badge-warning', label: 'Kısmi', icon: <FiClock /> },
      pending: { class: 'badge-info', label: 'Bekliyor', icon: <FiClock /> },
      overdue: { class: 'badge-danger', label: 'Gecikmiş', icon: <FiXCircle /> },
    }
    return badges[status] || badges.pending
  }

  const getMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: 'Nakit',
      card: 'Kredi Kartı',
      transfer: 'Havale',
      installment: 'Taksitli',
    }
    return methods[method] || method
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    const matchesMethod = filterMethod === 'all' || payment.paymentMethod === filterMethod
    return matchesSearch && matchesStatus && matchesMethod
  })

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0)
  const totalRemaining = payments.reduce((sum, p) => sum + p.remainingAmount, 0)

  return (
    <AdminLayout>
      {/* Payment Stats */}
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="stat-card-sm">
            <div className="stat-label">Toplam Tutar</div>
            <div className="stat-value">₺{totalAmount.toLocaleString()}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card-sm success">
            <div className="stat-label">Tahsil Edilen</div>
            <div className="stat-value">₺{totalPaid.toLocaleString()}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card-sm warning">
            <div className="stat-label">Bekleyen</div>
            <div className="stat-value">₺{totalRemaining.toLocaleString()}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card-sm danger">
            <div className="stat-label">Gecikmiş</div>
            <div className="stat-value">{payments.filter(p => p.status === 'overdue').length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-icon">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Öğrenci veya kurs ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="paid">Ödendi</option>
                <option value="partial">Kısmi Ödeme</option>
                <option value="pending">Bekliyor</option>
                <option value="overdue">Gecikmiş</option>
              </select>
            </div>
            <div className="col-md-4">
              <select 
                className="form-control"
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <option value="all">Tüm Ödeme Yöntemleri</option>
                <option value="cash">Nakit</option>
                <option value="card">Kredi Kartı</option>
                <option value="transfer">Havale</option>
                <option value="installment">Taksitli</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Öğrenci</th>
                  <th>Kurs</th>
                  <th>Toplam</th>
                  <th>Ödenen</th>
                  <th>Kalan</th>
                  <th>Ödeme Tarihi</th>
                  <th>Son Tarih</th>
                  <th>Yöntem</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const statusBadge = getStatusBadge(payment.status)
                  return (
                    <tr key={payment.id}>
                      <td className="text-muted">#{payment.id}</td>
                      <td><strong>{payment.studentName}</strong></td>
                      <td>{payment.course}</td>
                      <td><strong>₺{payment.amount.toLocaleString()}</strong></td>
                      <td className="text-success">₺{payment.paidAmount.toLocaleString()}</td>
                      <td className={payment.remainingAmount > 0 ? 'text-danger' : 'text-muted'}>
                        ₺{payment.remainingAmount.toLocaleString()}
                      </td>
                      <td className="text-muted">{payment.paymentDate}</td>
                      <td className={payment.status === 'overdue' ? 'text-danger' : 'text-muted'}>
                        {payment.dueDate}
                      </td>
                      <td>
                        <span className="text-sm">
                          {getMethodLabel(payment.paymentMethod)}
                          {payment.installments && (
                            <div className="text-muted">
                              ({payment.installments.paid}/{payment.installments.total} taksit)
                            </div>
                          )}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.icon} {statusBadge.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-5 text-muted">
              <p>Arama kriterlerine uygun ödeme bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
