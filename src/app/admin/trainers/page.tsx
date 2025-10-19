'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiAward, FiBriefcase, FiBookOpen, FiUser } from 'react-icons/fi'

interface Trainer {
  id: number
  name: string
  position: string
  description: string
  specialty: string
  icon: string
  isActive: boolean
  order: number
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      id: 1,
      name: 'Uzman Eğitmen Kadromuz',
      position: 'MEB Onaylı Eğitmenler',
      description: 'Alanında deneyimli, sertifikalı eğitmen kadromuz.',
      specialty: 'İş Makineleri Eğitimi',
      icon: 'FiAward',
      isActive: true,
      order: 1
    },
    {
      id: 2,
      name: 'İş Güvenliği Ekibimiz',
      position: 'İSG Uzmanları',
      description: 'İş sağlığı ve güvenliği konusunda uzman kadro.',
      specialty: 'İş Sağlığı ve Güvenliği',
      icon: 'FiBriefcase',
      isActive: true,
      order: 2
    },
    {
      id: 3,
      name: 'Pratik Eğitim Ekibimiz',
      position: 'Saha Koordinatörleri',
      description: 'Pratik eğitimlerde deneyimli ve profesyonel kadro.',
      specialty: 'Uygulamalı Eğitim',
      icon: 'FiBookOpen',
      isActive: true,
      order: 3
    },
    {
      id: 4,
      name: 'Danışmanlık Ekibimiz',
      position: 'Eğitim Danışmanları',
      description: 'Kişiye özel eğitim planlaması ve danışmanlık hizmeti.',
      specialty: 'Eğitim Planlaması',
      icon: 'FiUser',
      isActive: true,
      order: 4
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    description: '',
    specialty: '',
    icon: 'FiUser'
  })

  const iconOptions = [
    { value: 'FiUser', label: 'Kullanıcı' },
    { value: 'FiAward', label: 'Ödül' },
    { value: 'FiBriefcase', label: 'Çanta' },
    { value: 'FiBookOpen', label: 'Kitap' },
    { value: 'FiShield', label: 'Kalkan' },
    { value: 'FiStar', label: 'Yıldız' }
  ]

  const handleToggleActive = (id: number) => {
    setTrainers(trainers.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t))
  }

  const handleDelete = (id: number) => {
    if (confirm('Bu eğitmeni silmek istediğinize emin misiniz?')) {
      setTrainers(trainers.filter(t => t.id !== id))
    }
  }

  const handleEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer)
    setFormData({
      name: trainer.name,
      position: trainer.position,
      description: trainer.description,
      specialty: trainer.specialty,
      icon: trainer.icon
    })
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingTrainer(null)
    setFormData({
      name: '',
      position: '',
      description: '',
      specialty: '',
      icon: 'FiUser'
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTrainer) {
      setTrainers(trainers.map(t => 
        t.id === editingTrainer.id 
          ? { ...t, ...formData }
          : t
      ))
    } else {
      const newTrainer: Trainer = {
        id: Math.max(...trainers.map(t => t.id), 0) + 1,
        ...formData,
        isActive: true,
        order: trainers.length + 1
      }
      setTrainers([...trainers, newTrainer])
    }
    
    setIsModalOpen(false)
  }

  const moveUp = (id: number) => {
    const index = trainers.findIndex(t => t.id === id)
    if (index > 0) {
      const newTrainers = [...trainers]
      const temp = newTrainers[index - 1]
      newTrainers[index - 1] = newTrainers[index]
      newTrainers[index] = temp
      newTrainers.forEach((t, i) => t.order = i + 1)
      setTrainers(newTrainers)
    }
  }

  const moveDown = (id: number) => {
    const index = trainers.findIndex(t => t.id === id)
    if (index < trainers.length - 1) {
      const newTrainers = [...trainers]
      const temp = newTrainers[index + 1]
      newTrainers[index + 1] = newTrainers[index]
      newTrainers[index] = temp
      newTrainers.forEach((t, i) => t.order = i + 1)
      setTrainers(newTrainers)
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      FiUser, FiAward, FiBriefcase, FiBookOpen
    }
    const Icon = icons[iconName] || FiUser
    return <Icon size={20} />
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={handleAdd} className="btn btn-primary">
          <FiPlus /> Yeni Eğitmen Ekle
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FiUser /></div>
          <div className="stat-info">
            <div className="stat-label">Toplam Eğitmen</div>
            <div className="stat-value">{trainers.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><FiEye /></div>
          <div className="stat-info">
            <div className="stat-label">Aktif Eğitmen</div>
            <div className="stat-value">{trainers.filter(t => t.isActive).length}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Tüm Eğitmenler</h2>
        </div>
        <div className="card-body">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>İkon</th>
                  <th>İsim</th>
                  <th>Pozisyon</th>
                  <th>Açıklama</th>
                  <th>Uzmanlık</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {trainers.sort((a, b) => a.order - b.order).map((trainer, index) => (
                  <tr key={trainer.id} style={{ opacity: trainer.isActive ? 1 : 0.5 }}>
                    <td>{trainer.order}</td>
                    <td>{getIconComponent(trainer.icon)}</td>
                    <td><strong>{trainer.name}</strong></td>
                    <td>{trainer.position}</td>
                    <td style={{ maxWidth: '300px' }}>{trainer.description}</td>
                    <td>
                      <span className="badge badge-primary">{trainer.specialty}</span>
                    </td>
                    <td>
                      <span className={`badge ${trainer.isActive ? 'badge-success' : 'badge-secondary'}`}>
                        {trainer.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => moveUp(trainer.id)} 
                          className="btn btn-secondary btn-sm"
                          disabled={index === 0}
                          title="Yukarı Taşı"
                        >
                          ↑
                        </button>
                        <button 
                          onClick={() => moveDown(trainer.id)} 
                          className="btn btn-secondary btn-sm"
                          disabled={index === trainers.length - 1}
                          title="Aşağı Taşı"
                        >
                          ↓
                        </button>
                        <button 
                          onClick={() => handleToggleActive(trainer.id)} 
                          className={`btn btn-sm ${trainer.isActive ? 'btn-warning' : 'btn-success'}`}
                          title={trainer.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                        >
                          {trainer.isActive ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button 
                          onClick={() => handleEdit(trainer)} 
                          className="btn btn-secondary btn-sm"
                          title="Düzenle"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          onClick={() => handleDelete(trainer.id)} 
                          className="btn btn-danger btn-sm"
                          title="Sil"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={editingTrainer ? 'Eğitmen Düzenle' : 'Yeni Eğitmen Ekle'}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>İsim / Başlık</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Pozisyon</label>
              <input
                type="text"
                className="form-control"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Açıklama</label>
              <textarea
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label>Uzmanlık Alanı</label>
              <input
                type="text"
                className="form-control"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>İkon</label>
              <select
                className="form-control"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              >
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                İptal
              </button>
              <button type="submit" className="btn btn-primary">
                {editingTrainer ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  )
}
