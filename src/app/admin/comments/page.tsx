'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiSearch, FiEye, FiEyeOff, FiTrash2, FiCheck, FiX, FiStar } from 'react-icons/fi'

interface Comment {
  id: number
  author: string
  email: string
  course: string
  rating: number
  comment: string
  date: string
  isPublished: boolean
  isStarred: boolean
}

export default function CommentsPage() {
  // ...

  // Yıldız render fonksiyonu
  function renderStars(rating: number) {
    return (
      <span style={{ display: 'flex', gap: '2px', color: '#ffc107' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star}>{star <= rating ? '★' : '☆'}</span>
        ))}
      </span>
    );
  }

  // Yayınla/yayından kaldır
  function togglePublish(id: number) {
    setComments(prev => prev.map(c => c.id === id ? { ...c, isPublished: !c.isPublished } : c));
  }

  // Öne çıkar/çıkar kaldır
  function toggleStar(id: number) {
    setComments(prev => prev.map(c => c.id === id ? { ...c, isStarred: !c.isStarred } : c));
  }

  // Sil
  function deleteComment(id: number) {
    setComments(prev => prev.filter(c => c.id !== id));
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [comments, setComments] = useState<Comment[]>([
    { 
      id: 1, 
      author: 'Ahmet Yılmaz', 
      email: 'ahmet@example.com', 
      course: 'Forklift Operatörlüğü', 
      rating: 5, 
      comment: 'Harika bir eğitimdi! Eğitmenler çok profesyonel ve ekipmanlar modern. Kesinlikle tavsiye ediyorum.', 
      date: '2025-10-12 14:30', 
      isPublished: true, 
      isStarred: false 
    },
    { 
      id: 2, 
      author: 'Fatma Demir', 
      email: 'fatma@example.com',
      course: 'Vinc Operatörlüğü',
      rating: 4,
      comment: 'Eğitim içeriği çok faydalıydı. Saha uygulamaları özellikle güzeldi.',
      date: '2025-10-10 09:15',
      isPublished: false,
      isStarred: true
    }
  ]);

  // Yorumları filtrele
  const filteredComments = comments.filter(comment => {
    if (filterStatus === 'published' && !comment.isPublished) return false;
    if (filterStatus === 'unpublished' && comment.isPublished) return false;
    if (searchTerm && !(
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.comment.toLowerCase().includes(searchTerm.toLowerCase())
    )) return false;
    return true;
  });

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="stats-grid mb-3">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiEye />
          </div>
          <div className="stat-info">
            <div className="stat-label">Toplam Yorum</div>
            <div className="stat-value">{comments.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <FiCheck />
          </div>
          <div className="stat-info">
            <div className="stat-label">Yayınlanan</div>
            <div className="stat-value">{comments.filter(c => c.isPublished).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <FiX />
          </div>
          <div className="stat-info">
            <div className="stat-label">Bekleyen</div>
            <div className="stat-value">{comments.filter(c => !c.isPublished).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">
            <FiStar />
          </div>
          <div className="stat-info">
            <div className="stat-label">Öne Çıkan</div>
            <div className="stat-value">{comments.filter(c => c.isStarred).length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-icon">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Yorum ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select 
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tüm Yorumlar</option>
                <option value="published">Yayınlanan</option>
                <option value="unpublished">Bekleyen</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {filteredComments.map((comment) => (
          <div key={comment.id}>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                    {comment.author}
                  </h3>
                  {renderStars(comment.rating)}
                  {comment.isStarred && (
                    <span style={{ color: '#ffc107' }}>
                      <FiStar size={18} fill="#ffc107" />
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                  {comment.email} • {comment.course} • {comment.date}
                </div>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  minHeight: '70px'
                }}>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>
                    {comment.comment}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: 'auto' }}>
                  <button 
                    className={`btn btn-sm ${comment.isPublished ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => togglePublish(comment.id)}
                  >
                    {comment.isPublished ? (
                      <><FiEye /> Yayında</>
                    ) : (
                      <><FiEyeOff /> Yayınla</>
                    )}
                  </button>
                  <button 
                    className={`btn btn-sm ${comment.isStarred ? 'btn-warning' : 'btn-secondary'}`}
                    onClick={() => toggleStar(comment.id)}
                  >
                    <FiStar /> {comment.isStarred ? 'Öne Çıkan' : 'Öne Çıkar'}
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <FiTrash2 /> Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredComments.length === 0 && (
          <div>
            <div className="card">
              <div className="card-body text-center py-5">
                <p className="text-muted">Yorum bulunamadı.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
