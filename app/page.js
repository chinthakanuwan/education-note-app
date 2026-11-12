'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import Camera from '../components/Camera';
import NoteCard from '../components/NoteCard';
import Header from '../components/Header';

export default function Home() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Biology');

  const subjects = ['Biology', 'Chemistry', 'Physics', 'Maths', 'English', 'Sinhala', 'History', 'Other'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadNotes(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadNotes = async (userId) => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const notesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotes(notesData);
  };

  const handleGenerateNote = async (imageData) => {
    if (!user) {
      alert('Please sign in first!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          subject: selectedSubject,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await addDoc(collection(db, 'notes'), {
          userId: user.uid,
          subject: selectedSubject,
          originalImage: imageData,
          summary: data.summary,
          keyPoints: data.keyPoints,
          flashcards: data.flashcards,
          createdAt: new Date().toISOString(),
        });
        
        loadNotes(user.uid);
        setShowCamera(false);
      } else {
        alert('Error generating note: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (confirm('Delete this note?')) {
      await deleteDoc(doc(db, 'notes', noteId));
      loadNotes(user.uid);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setNotes([]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">📚 Education Notes</h1>
          <p className="text-gray-600 mb-6">AI-powered study notes generator</p>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Subject Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Select Subject:</h2>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedSubject === subject
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Teacher Ad Space */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4 text-center">
          <p className="text-sm text-gray-600 mb-1">📢 Sponsored by</p>
          <p className="font-bold text-gray-800">[Teacher Name / Institute]</p>
          <p className="text-xs text-gray-500 mt-1">Contact: [Phone/Email]</p>
        </div>

        {/* Capture Button */}
        {!showCamera && (
          <button
            onClick={() => setShowCamera(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition mb-6"
          >
            📸 Capture Page
          </button>
        )}

        {/* Camera Component */}
        {showCamera && (
          <Camera
            onCapture={handleGenerateNote}
            onCancel={() => setShowCamera(false)}
            loading={loading}
          />
        )}

        {/* Notes List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Your Notes</h2>
          {notes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No notes yet. Capture your first page!</p>
          ) : (
            notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={() => handleDeleteNote(note.id)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
