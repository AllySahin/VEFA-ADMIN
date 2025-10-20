"use client";
import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
}

const initialBlogs: Blog[] = [
  {
    id: 1,
    title: 'İş Güvenliği İçin 10 İpucu',
    summary: 'İş yerinde güvenliği artırmak için uygulayabileceğiniz 10 temel ipucu.',
    content: 'İş güvenliği için ... (detaylı içerik)',
    date: '2025-10-01',
  },
  {
    id: 2,
    title: 'Forklift Eğitimi Neden Önemli?',
    summary: 'Forklift operatörleri için eğitim neden hayati önem taşır?',
    content: 'Forklift eğitimi ... (detaylı içerik)',
    date: '2025-09-15',
  },
];

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [showForm, setShowForm] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', summary: '', content: '', date: '' });

  const handleAddBlog = () => {
    if (!newBlog.title || !newBlog.summary || !newBlog.content) return;
    setBlogs([
      ...blogs,
      { id: Math.max(...blogs.map(b => b.id), 0) + 1, ...newBlog, date: new Date().toISOString().slice(0, 10) }
    ]);
    setShowForm(false);
    setNewBlog({ title: '', summary: '', content: '', date: '' });
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Yeni Blog Yazısı Ekle
        </button>
      </div>
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <input type="text" className="form-control mb-2" placeholder="Başlık" value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} />
            <input type="text" className="form-control mb-2" placeholder="Özet" value={newBlog.summary} onChange={e => setNewBlog({ ...newBlog, summary: e.target.value })} />
            <textarea className="form-control mb-2" rows={5} placeholder="İçerik" value={newBlog.content} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} />
            <button className="btn btn-success" onClick={handleAddBlog}>Kaydet</button>
            <button className="btn btn-secondary ml-2" onClick={() => setShowForm(false)}>İptal</button>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Blog Yazıları</h2>
        </div>
        <div className="card-body">
          {blogs.map(blog => (
            <div key={blog.id} className="card mb-3">
              <div className="card-body">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{blog.title}</h3>
                <div style={{ color: '#888', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{blog.date}</div>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>{blog.summary}</p>
                <div style={{ fontSize: '1rem', color: '#444' }}>{blog.content.substring(0, 80)}...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
