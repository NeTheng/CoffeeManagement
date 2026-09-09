import React, { useState, useEffect } from 'react';
import { notesAPI } from '../services/notesService';

export const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  });

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notesAPI.getNotes();
      // Ensure data is an array and filter out null values
      const notesList = Array.isArray(data) ? data.filter(n => n && n.id) : [];
      setNotes(notesList);
    } catch (err) {
      setError(err.message);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    try {
      const newNote = await notesAPI.createNote(
        formData.title,
        formData.content,
        formData.category,
        formData.tags
      );
      
      // Ensure newNote is valid before adding
      if (newNote && newNote.id) {
        setNotes([newNote, ...notes]);
        setFormData({ title: '', content: '', category: '', tags: '' });
        setShowForm(false);
        setSuccess('Note created successfully!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!selectedNote || !selectedNote.id) {
      setError('No note selected');
      return;
    }

    setIsLoading(true);
    try {
      const updatedNote = await notesAPI.updateNote(
        selectedNote.id,
        formData.title,
        formData.content,
        formData.category,
        formData.tags
      );
      
      // Ensure updatedNote is valid
      if (updatedNote && updatedNote.id) {
        setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
        setSelectedNote(updatedNote);
        setIsEditing(false);
        setShowForm(false);
        setSuccess('Note updated successfully!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await notesAPI.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
      setShowDeleteConfirm(null);
      setSuccess('Note deleted successfully!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setFormData({ title: '', content: '', category: '', tags: '' });
    setIsEditing(false);
    setShowForm(true);
  };

  const openEditForm = () => {
    if (!selectedNote) {
      setError('No note selected');
      return;
    }
    setFormData({
      title: selectedNote.title || '',
      content: selectedNote.content || '',
      category: selectedNote.category || '',
      tags: selectedNote.tags || '',
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">📝 Notes</h1>
          <p className="text-gray-600">Manage your personal notes and thoughts</p>
        </div>
        {!showForm && (
          <button
            onClick={openCreateForm}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
          >
            ➕ New Note
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200 flex items-center animate-fade-out">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 flex items-center animate-fade-out">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b">
              <h2 className="font-semibold text-slate-900">Your Notes ({notes.length})</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {notes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p>No notes yet. Create one to get started!</p>
                </div>
              ) : (
                notes.map((note) => {
                  if (!note || !note.id) return null;
                  return (
                    <button
                      key={note.id}
                      onClick={() => {
                        setSelectedNote(note);
                        setShowForm(false);
                      }}
                      className={`w-full text-left p-4 hover:bg-blue-50 transition ${
                        selectedNote?.id === note.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <h3 className="font-semibold text-slate-900 truncate">{note.title || 'Untitled'}</h3>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(note.updatedAt)}</p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {showForm ? (
            /* Create/Edit Form */
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {isEditing ? '✏️ Edit Note' : '📝 Create New Note'}
              </h2>
              <form onSubmit={isEditing ? handleUpdateNote : handleCreateNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    maxLength="200"
                    placeholder="Enter note title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    maxLength="5000"
                    placeholder="Enter note content"
                    rows="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.content.length}/5000</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      maxLength="50"
                      placeholder="e.g., Work, Personal"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      maxLength="500"
                      placeholder="e.g., urgent, todo, idea"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : isEditing ? 'Update Note' : 'Create Note'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ title: '', content: '', category: '', tags: '' });
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-900 font-semibold py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : selectedNote ? (
            /* Note Detail View */
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{selectedNote.title || 'Untitled'}</h1>
                  {selectedNote.category && (
                    <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {selectedNote.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={openEditForm}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(selectedNote.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content || 'No content'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-semibold text-slate-900">{formatDate(selectedNote.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-semibold text-slate-900">{formatDate(selectedNote.updatedAt)}</p>
                </div>
                {selectedNote.tags && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedNote.tags.split(',').map((tag, i) => (
                        <span key={i} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">Select a note or create a new one to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Delete Note?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteNote(showDeleteConfirm)}
                disabled={isLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isLoading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-900 font-semibold py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
