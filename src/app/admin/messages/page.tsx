'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiSearch, FiMail, FiTrash2, FiEye, FiArchive, FiStar } from 'react-icons/fi'

interface Message {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
  status: 'unread' | 'read' | 'archived'
  isStarred: boolean
  category: 'genel' | 'kurs' | 'sertifika' | 'ödeme'
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', phone: '0532 111 2233', subject: 'Forklift eğitimi hakkında', message: 'Merhaba, forklift eğitimi için kayıt olmak istiyorum. Detaylı bilgi alabilir miyim?', date: '2025-10-12 14:30', status: 'unread', isStarred: false, category: 'kurs' },
    { id: 2, name: 'Fatma Demir', email: 'fatma@example.com', phone: '0533 222 3344', subject: 'Sertifika sorgulama', message: 'Aldığım sertifikayı nasıl sorgulayabilirim?', date: '2025-10-12 10:15', status: 'read', isStarred: true, category: 'sertifika' },
    { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', phone: '0534 333 4455', subject: 'Ödeme seçenekleri', message: 'Taksitli ödeme imkanı var mı? Kredi kartı ile ödeme yapabilir miyim?', date: '2025-10-11 16:45', status: 'read', isStarred: false, category: 'ödeme' },
    { id: 4, name: 'Ayşe Yıldız', email: 'ayse@example.com', phone: '0535 444 5566', subject: 'Kurs tarihleri', message: 'Vinç operatörlüğü kursunun başlangıç tarihi ne zaman?', date: '2025-10-11 09:20', status: 'unread', isStarred: true, category: 'kurs' },
    { id: 5, name: 'Ali Öztürk', email: 'ali@example.com', phone: '0536 555 6677', subject: 'Genel bilgi', message: 'Merkezinizin adresi nedir? Ziyaret saatleri hakkında bilgi alabilir miyim?', date: '2025-10-10 13:00', status: 'archived', isStarred: false, category: 'genel' },
  ])

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      genel: { class: 'badge-secondary', label: 'Genel' },
      kurs: { class: 'badge-primary', label: 'Kurs' },
      sertifika: { class: 'badge-info', label: 'Sertifika' },
      ödeme: { class: 'badge-success', label: 'Ödeme' },
    }
    return badges[category] || badges.genel
  }

  const toggleStar = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
    ))
  }

  const markAsRead = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, status: 'read' } : msg
    ))
  }

  const archiveMessage = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, status: 'archived' } : msg
    ))
  }

  const deleteMessage = (id: number) => {
    if (confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      setMessages(messages.filter(msg => msg.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    }
  }

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || msg.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter(m => m.status === 'unread').length

  return (
    <AdminLayout>
      <div className="row">
        {/* Messages List */}
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              {/* Search and Filter */}
              <div className="mb-3">
                <div className="input-group mb-2">
                  <span className="input-group-icon">
                    <FiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mesaj ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="form-control"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tüm Mesajlar</option>
                  <option value="unread">Okunmamış</option>
                  <option value="read">Okunmuş</option>
                  <option value="archived">Arşivlenmiş</option>
                </select>
              </div>

              {/* Messages List */}
              <div className="messages-list">
                {filteredMessages.map((msg) => {
                  const categoryBadge = getCategoryBadge(msg.category)
                  return (
                    <div 
                      key={msg.id} 
                      className={`message-item ${msg.status === 'unread' ? 'unread' : ''} ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedMessage(msg)
                        markAsRead(msg.id)
                      }}
                    >
                      <div className="message-header">
                        <div className="message-sender">
                          <button 
                            className={`star-btn ${msg.isStarred ? 'starred' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleStar(msg.id)
                            }}
                          >
                            <FiStar />
                          </button>
                          <strong>{msg.name}</strong>
                        </div>
                        <span className="message-date">{msg.date.split(' ')[0]}</span>
                      </div>
                      <div className="message-subject">{msg.subject}</div>
                      <div className="message-preview">{msg.message.substring(0, 60)}...</div>
                      <div className="message-footer">
                        <span className={`badge ${categoryBadge.class}`}>
                          {categoryBadge.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
                
                {filteredMessages.length === 0 && (
                  <div className="text-center py-4 text-muted">
                    Mesaj bulunamadı.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="col-lg-7">
          <div className="card">
            <div className="card-body">
              {selectedMessage ? (
                <div className="message-detail">
                  <div className="message-detail-header">
                    <div>
                      <h2 className="message-detail-subject">{selectedMessage.subject}</h2>
                      <span className={`badge ${getCategoryBadge(selectedMessage.category).class}`}>
                        {getCategoryBadge(selectedMessage.category).label}
                      </span>
                    </div>
                    <div className="message-detail-actions">
                      <button 
                        className="btn-icon"
                        onClick={() => archiveMessage(selectedMessage.id)}
                        title="Arşivle"
                      >
                        <FiArchive />
                      </button>
                      <button 
                        className="btn-icon text-danger"
                        onClick={() => deleteMessage(selectedMessage.id)}
                        title="Sil"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  <div className="message-detail-sender">
                    <div className="sender-avatar">
                      <FiMail size={24} />
                    </div>
                    <div className="sender-info">
                      <strong>{selectedMessage.name}</strong>
                      <div className="text-muted text-sm">{selectedMessage.email}</div>
                      <div className="text-muted text-sm">{selectedMessage.phone}</div>
                    </div>
                    <div className="message-detail-date text-muted">
                      {selectedMessage.date}
                    </div>
                  </div>

                  <div className="message-detail-content">
                    <p>{selectedMessage.message}</p>
                  </div>

                  <div className="message-detail-reply">
                    <button className="btn btn-primary">
                      <FiMail /> Yanıtla
                    </button>
                  </div>
                </div>
              ) : (
                <div className="message-detail-empty">
                  <FiMail size={64} />
                  <h3>Mesaj Seçilmedi</h3>
                  <p className="text-muted">Detaylarını görmek için bir mesaj seçin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mt-3">
        <div className="col-md-3">
          <div className="stat-card-sm">
            <div className="stat-label">Toplam Mesaj</div>
            <div className="stat-value">{messages.length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card-sm">
            <div className="stat-label">Okunmamış</div>
            <div className="stat-value">{messages.filter(m => m.status === 'unread').length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card-sm">
            <div className="stat-label">Yıldızlı</div>
            <div className="stat-value">{messages.filter(m => m.isStarred).length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card-sm">
            <div className="stat-label">Arşivlenmiş</div>
            <div className="stat-value">{messages.filter(m => m.status === 'archived').length}</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
