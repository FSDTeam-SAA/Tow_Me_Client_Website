import { useEffect, useState } from 'react'
import { api } from './api'
import './TermsPage.css'

export default function TermsPage() {
  const [terms, setTerms] = useState(null)
  const [error, setError] = useState('')
  const load = async () => {
    setError('')
    try { setTerms(await api.getTerms()) }
    catch { setError('לא ניתן לטעון את תנאי השימוש. נסה שוב.') }
  }
  useEffect(() => { load() }, [])
  return <main className="terms-page" dir="rtl">
    <a href="/">חזרה לאתר</a>
    <h1>{terms?.title || 'תנאי שימוש'}</h1>
    {error ? <div role="alert"><p>{error}</p><button onClick={load}>נסה שוב</button></div> :
      terms ? <><p>עודכן לאחרונה: {new Date(terms.updatedAt).toLocaleDateString('he-IL')}</p>
        <article dangerouslySetInnerHTML={{ __html: terms.content }} /></> : <p role="status">טוען...</p>}
  </main>
}
