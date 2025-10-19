'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'

interface Service {
  id: number
  title: string
  description: string
  icon: string
  order: number
  isActive: boolean
  features: string[]
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: 'Forklift Operatörlüğü',
      description: 'Sertifikalı forklift operatör eğitimi',
      icon: '🚜',
      order: 1,
      isActive: true,
      features: ['MEB Onaylı', 'Uygulamalı Eğitim', '40 Saat']
    },
    {
      id: 2,
      title: 'Vinç Operatörlüğü',
      description: 'Profesyonel vinç operatör sertifikası',
      icon: '🏗️',
      order: 2,
      isActive: true,
      features: ['Kule Vinç', 'Mobil Vinç', '50 Saat']
    },
    {
      id: 3,
      title: 'İş Güvenliği Eğitimi',
      description: 'İSG uzman yardımcısı ve uzman eğitimi',
      icon: '🦺',
      order: 3,
      isActive: true,
      features: ['İSG Sertifikası', 'Yasal Mevzuat', '120 Saat']
    },
    {
      id: 4,
      title: 'Ekskavatör Eğitimi',
      description: 'Kazı ve hafriyat makineleri eğitimi',
      icon: '🚧',
      order: 4,
      isActive: true,
      features: ['Uygulamalı', 'Sertifikalı', '60 Saat']
    },
    {
      id: 5,
      title: 'Beko Loder',
      description: 'Beko loder operatör belgelendirme',
      icon: '🏗️',
      order: 5,
      isActive: false,
      features: ['Yükleme', 'Kazı', '45 Saat']
    },
    {
      id: 6,
      title: 'Manlift Eğitimi',
      description: 'Yüksekte çalışma platformu eğitimi',
      icon: '⬆️',
      order: 6,
      isActive: true,
      features: ['Yüksekte Çalışma', 'Güvenlik', '35 Saat']
    },
  ])

  const toggleActive = (id: number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ))
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary">
          <FiPlus /> Yeni Hizmet Ekle
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <div className="stat-card-sm">
            <div className="stat-label">Toplam Hizmet</div>
            <div className="stat-value">{services.length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card-sm">
            <div className="stat-label">Aktif Hizmetler</div>
            <div className="stat-value">{services.filter(s => s.isActive).length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card-sm">
            <div className="stat-label">Pasif Hizmetler</div>
            <div className="stat-value">{services.filter(s => !s.isActive).length}</div>
          </div>
        </div>
      </div>

      <div className="row">
        {services.map((service) => (
          <div key={service.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card service-card">
              <div className="service-header">
                <div className="service-icon">{service.icon}</div>
                <div className="service-order">#{service.order}</div>
              </div>
              <div className="card-body">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                <div className="service-features">
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="feature-badge">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="service-status">
                  <button 
                    className={`btn btn-sm w-100 ${service.isActive ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => toggleActive(service.id)}
                  >
                    {service.isActive ? <FiEye /> : <FiEyeOff />}
                    {service.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </div>

                <div className="service-actions">
                  <button className="btn btn-secondary btn-sm flex-1">
                    <FiEdit2 /> Düzenle
                  </button>
                  <button className="btn-icon text-danger">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Form Card */}
      <div className="card mt-3">
        <div className="card-header">
          <h2 className="card-title">Hizmet Bilgileri</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <strong>Not:</strong> Hizmetler ana sayfada görünecek ve kullanıcılar bu hizmetler hakkında bilgi alabilecektir.
            Her hizmete ait özellikler ve açıklamalar detaylı olarak girilmelidir.
          </div>
          
          <div className="info-list">
            <div className="info-item">
              <strong>Hizmet Başlığı:</strong> Kısa ve açıklayıcı olmalı
            </div>
            <div className="info-item">
              <strong>Açıklama:</strong> Hizmetin detaylı tanımı
            </div>
            <div className="info-item">
              <strong>Özellikler:</strong> Hizmete ait öne çıkan özellikler
            </div>
            <div className="info-item">
              <strong>İkon:</strong> Hizmeti temsil eden emoji veya ikon
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
