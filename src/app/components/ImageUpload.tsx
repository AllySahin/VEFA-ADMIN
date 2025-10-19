'use client'

import React, { useState, useRef } from 'react'
import { FiUpload, FiX, FiImage, FiLoader, FiTrash2 } from 'react-icons/fi'

interface ImageUploadProps {
  value?: string
  onChange: (imageUrl: string) => void
  onError?: (error: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onError, 
  placeholder = "Görsel seçin veya sürükleyip bırakın", 
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string>(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Dosya tipini kontrol et
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      const error = 'Geçersiz dosya tipi. Sadece JPEG, PNG, WebP ve GIF formatları desteklenmektedir.'
      onError?.(error)
      return
    }

    // Dosya boyutunu kontrol et (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      const error = 'Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.'
      onError?.(error)
      return
    }

    setIsUploading(true)

    try {
      // Önizleme için file URL oluştur
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // FormData oluştur
      const formData = new FormData()
      formData.append('file', file)

      // API'ye yükle
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setPreview(result.imageUrl)
        onChange(result.imageUrl)
        // Object URL'i temizle
        URL.revokeObjectURL(previewUrl)
      } else {
        throw new Error(result.error || 'Dosya yüklenirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setPreview('')
      onError?.(error instanceof Error ? error.message : 'Dosya yüklenirken bir hata oluştu')
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleFileSelect(imageFile)
    }
  }

  const handleRemoveImage = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="image-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        style={{ display: 'none' }}
      />
      
      {preview ? (
        <div className="image-preview">
          <div className="preview-container">
            <img 
              src={preview} 
              alt="Preview" 
              className="preview-image"
            />
            <div className="preview-overlay">
              <button
                type="button"
                onClick={handleClick}
                disabled={disabled || isUploading}
                className="btn btn-sm btn-secondary"
                title="Görseli Değiştir"
              >
                <FiUpload /> Değiştir
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled || isUploading}
                className="btn btn-sm btn-danger"
                title="Görseli Kaldır"
              >
                <FiTrash2 /> Kaldır
              </button>
            </div>
          </div>
          {preview.startsWith('/') && (
            <div className="image-path">
              <small className="text-muted">Yol: {preview}</small>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="upload-content">
            {isUploading ? (
              <>
                <FiLoader className="upload-icon spinning" />
                <span className="upload-text">Yükleniyor...</span>
              </>
            ) : (
              <>
                <FiImage className="upload-icon" />
                <span className="upload-text">{placeholder}</span>
                <small className="upload-hint">
                  JPEG, PNG, WebP, GIF formatları desteklenir (Max: 5MB)
                </small>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .image-upload-container {
          width: 100%;
        }

        .upload-dropzone {
          border: 2px dashed #cbd5e0;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f8fafc;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-dropzone:hover:not(.disabled) {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .upload-dropzone.dragging {
          border-color: #3b82f6;
          background: #dbeafe;
        }

        .upload-dropzone.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-icon {
          font-size: 2rem;
          color: #6b7280;
        }

        .upload-icon.spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .upload-text {
          font-weight: 500;
          color: #374151;
        }

        .upload-hint {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .image-preview {
          width: 100%;
        }

        .preview-container {
          position: relative;
          display: inline-block;
          border-radius: 8px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .preview-image {
          max-width: 100%;
          max-height: 200px;
          width: auto;
          height: auto;
          display: block;
        }

        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .preview-container:hover .preview-overlay {
          opacity: 1;
        }

        .image-path {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}