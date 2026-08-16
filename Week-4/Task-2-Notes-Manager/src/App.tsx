import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

type Note = {
  id: number
  title: string
  content: string | null
  created_at: string
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setNotes(data || [])
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const saveNote = async () => {
    if (!title.trim()) {
      alert('Please enter a title.')
      return
    }

    setLoading(true)

    if (editingId !== null) {
      const { error } = await supabase
        .from('notes')
        .update({
          title: title.trim(),
          content: content.trim(),
        })
        .eq('id', editingId)

      if (error) {
        alert(error.message)
      } else {
        setEditingId(null)
        setTitle('')
        setContent('')
        await fetchNotes()
      }
    } else {
      const { error } = await supabase
        .from('notes')
        .insert({
          title: title.trim(),
          content: content.trim(),
        })

      if (error) {
        alert(error.message)
      } else {
        setTitle('')
        setContent('')
        await fetchNotes()
      }
    }

    setLoading(false)
  }

  const editNote = (note: Note) => {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content || '')
  }

  const deleteNote = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this note?')

    if (!confirmed) return

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    await fetchNotes()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Notes Manager</h1>
        <p className="subtitle">Save and manage your personal notes</p>

        <div className="note-form">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />

          <div className="form-buttons">
            <button onClick={saveNote} disabled={loading}>
              {loading
                ? 'Saving...'
                : editingId !== null
                ? 'Update Note'
                : 'Add Note'}
            </button>

            {editingId !== null && (
              <button className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </div>

        <h2>My Notes</h2>

        {notes.length === 0 ? (
          <p className="empty">No notes yet. Add your first note!</p>
        ) : (
          <div className="notes-list">
            {notes.map((note) => (
              <div className="note-card" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>

                <div className="note-actions">
                  <button onClick={() => editNote(note)}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App