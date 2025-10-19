'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiSend, FiUsers, FiUser, FiFilter, FiTrash2, FiEye } from 'react-icons/fi'

interface Notification {
  id: number
  title: string
  message: string
  recipients: string
  recipientCount: number
  status: 'sent' | 'scheduled' | 'draft'
  sentDate: string
  readCount: number
  type: 'info' | 'warning' | 'success' | 'danger'
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('send')

  const notifications: Notification[] = [
    { id: 1, title: 'Yeni Kurs Duyurusu', message: 'Forklift operatörlük kursu başvuruları başladı.', recipients: 'Tüm Öğrenciler', recipientCount: 1247, status: 'sent', sentDate: '2025-10-12 10:00', readCount: 856, type: 'info' },
    { id: 2, title: 'Ödeme Hatırlatması', message: 'Ödeme vade tarihiniz yaklaşıyor. Lütfen ödemelerinizi kontrol edin.', recipients: 'Borçlu Öğrenciler', recipientCount: 45, status: 'sent', sentDate: '2025-10-11 14:30', readCount: 38, type: 'warning' },
    { id: 3, title: 'Sertifika Hazır', message: 'Kurs sertifikanız hazır. Merkezimizden teslim alabilirsiniz.', recipients: 'Kurs Tamamlayanlar', recipientCount: 23, status: 'sent', sentDate: '2025-10-10 09:15', readCount: 23, type: 'success' },
    { id: 4, title: 'Tatil Bildirimi', message: 'Merkez resmi tatil nedeniyle kapalı olacaktır.', recipients: 'Tüm Öğrenciler', recipientCount: 1247, status: 'scheduled', sentDate: '2025-10-20 08:00', readCount: 0, type: 'info' },
    { id: 5, title: 'Kurs İptali', message: 'Yeterli katılım sağlanamadığından kurs iptal edilmiştir.', recipients: 'Seçili Grup', recipientCount: 8, status: 'draft', sentDate: '-', readCount: 0, type: 'danger' },
  ]

  const recipientGroups = [
    { label: 'Tüm Öğrenciler', value: 'all', count: 1247 },
    { label: 'Aktif Öğrenciler', value: 'active', count: 856 },
    { label: 'Yeni Kayıtlar', value: 'new', count: 48 },
    { label: 'Kurs Tamamlayanlar', value: 'completed', count: 391 },
    { label: 'Borçlu Öğrenciler', value: 'debtors', count: 45 },
  ]

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      sent: { class: 'badge-success', label: 'Gönderildi' },
      scheduled: { class: 'badge-warning', label: 'Zamanlandı' },
      draft: { class: 'badge-secondary', label: 'Taslak' },
    }
    return badges[status] || badges.draft
  }

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      info: { class: 'badge-info', label: 'Bilgi' },
      warning: { class: 'badge-warning', label: 'Uyarı' },
      success: { class: 'badge-success', label: 'Başarı' },
      danger: { class: 'badge-danger', label: 'Önemli' },
    }
    return badges[type] || badges.info
  }

  return (
    <AdminLayout>
      {/* Tabs */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="notification-tabs">
            <button 
              className={`tab-btn ${activeTab === 'send' ? 'active' : ''}`}
              onClick={() => setActiveTab('send')}
            >
              <FiSend /> Bildirim Gönder
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <FiEye /> Gönderim Geçmişi
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'send' && (
        <div className="row">
          {/* Send Form */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Yeni Bildirim Oluştur</h2>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Bildirim Başlığı</label>
                  <input type="text" className="form-control" placeholder="Bildirimin başlığını girin..." />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Bildirim Türü</label>
                  <select className="form-control">
                    <option value="info">Bilgi</option>
                    <option value="warning">Uyarı</option>
                    <option value="success">Başarı</option>
                    <option value="danger">Önemli</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mesaj</label>
                  <textarea className="form-control" rows={5} placeholder="Bildirim mesajını yazın..."></textarea>
                  <small className="text-muted">Maksimum 500 karakter</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Alıcılar</label>
                  <select className="form-control">
                    {recipientGroups.map((group) => (
                      <option key={group.value} value={group.value}>
                        {group.label} ({group.count} kişi)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Gönderim Zamanı</label>
                  <div className="row">
                    <div className="col-md-6">
                      <select className="form-control">
                        <option value="now">Hemen Gönder</option>
                        <option value="scheduled">Zamanla</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <input type="datetime-local" className="form-control" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">E-posta ile de gönder</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">SMS ile de gönder</span>
                  </label>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-secondary">
                    Taslak Olarak Kaydet
                  </button>
                  <button className="btn btn-primary">
                    <FiSend /> Bildirimi Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Önizleme</h2>
              </div>
              <div className="card-body">
                <div className="notification-preview">
                  <div className="preview-notification info">
                    <div className="notification-header">
                      <strong>Bildirim Başlığı</strong>
                      <span className="notification-time">Şimdi</span>
                    </div>
                    <p className="notification-body">Bildirim mesajınız burada görünecek...</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <h2 className="card-title">
                  <FiUsers /> Alıcı Grupları
                </h2>
              </div>
              <div className="card-body">
                <div className="recipient-list">
                  {recipientGroups.map((group) => (
                    <div key={group.value} className="recipient-item">
                      <div className="recipient-info">
                        <strong>{group.label}</strong>
                        <span className="text-muted">{group.count} kişi</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card">
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Başlık</th>
                    <th>Mesaj</th>
                    <th>Alıcılar</th>
                    <th>Gönderim</th>
                    <th>Okunma</th>
                    <th>Tür</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => {
                    const statusBadge = getStatusBadge(notification.status)
                    const typeBadge = getTypeBadge(notification.type)
                    const readRate = notification.recipientCount > 0 
                      ? Math.round((notification.readCount / notification.recipientCount) * 100) 
                      : 0

                    return (
                      <tr key={notification.id}>
                        <td className="text-muted">#{notification.id}</td>
                        <td><strong>{notification.title}</strong></td>
                        <td className="notification-message">{notification.message}</td>
                        <td>
                          <div className="text-sm">
                            <div>{notification.recipients}</div>
                            <div className="text-muted">{notification.recipientCount} kişi</div>
                          </div>
                        </td>
                        <td className="text-muted">{notification.sentDate}</td>
                        <td>
                          {notification.status === 'sent' ? (
                            <div className="text-sm">
                              <div>{notification.readCount}/{notification.recipientCount}</div>
                              <div className="text-muted">%{readRate}</div>
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${typeBadge.class}`}>
                            {typeBadge.label}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${statusBadge.class}`}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn-icon" title="Detay">
                              <FiEye />
                            </button>
                            {notification.status === 'draft' && (
                              <button className="btn-icon text-danger" title="Sil">
                                <FiTrash2 />
                              </button>
                            )}
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
      )}

      {/* Stats */}
      <div className="row mt-3">
        <div className="col-md-3">
          <div className="stat-card-sm">
            <div className="stat-label">Toplam Gönderim</div>
            <div className="stat-value">{notifications.filter(n => n.status === 'sent').length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card-sm">
            <div className="stat-label">Zamanlanmış</div>
            <div className="stat-value">{notifications.filter(n => n.status === 'scheduled').length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card-sm">
            <div className="stat-label">Taslak</div>
            <div className="stat-value">{notifications.filter(n => n.status === 'draft').length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card-sm">
            <div className="stat-label">Ort. Okunma</div>
            <div className="stat-value">
              %{Math.round(
                notifications
                  .filter(n => n.status === 'sent')
                  .reduce((acc, n) => acc + (n.readCount / n.recipientCount * 100), 0) /
                notifications.filter(n => n.status === 'sent').length
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
