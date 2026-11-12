'use client';

import { useState } from 'react';

export default function NoteCard({ note, onDelete }) {
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  const date = new Date(note.createdAt).toLocaleDateString('si-LK');

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            {note.subject}
          </span>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Summary:</h4>
        <p className="text-gray-700 text-sm leading-relaxed">{note.summary}</p>
      </div>

      {/* Key Points */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Key Points:</h4>
        <ul className="space-y-1">
          {note.keyPoints.map((point, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex">
              <span className="text-blue-600 mr-2">•</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Flashcards Toggle */}
      <button
        onClick={() => setShowFlashcards(!showFlashcards)}
        className="w-full bg-indigo-50 text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-100 transition mb-3"
      >
        {showFlashcards ? 'Hide' : 'Show'} Flashcards ({note.flashcards.length})
      </button>

      {/* Flashcards */}
      {showFlashcards && note.flashcards.length > 0 && (
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">Card {currentCard + 1} of {note.flashcards.length}</p>
            <p className="font-semibold text-gray-800 mb-3">
              Q: {note.flashcards[currentCard].question}
            </p>
            <p className="text-gray-700 text-sm">
              A: {note.flashcards[currentCard].answer}
            </p>
            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
                disabled={currentCard === 0}
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentCard(Math.min(note.flashcards.length - 1, currentCard + 1))}
                disabled={currentCard === note.flashcards.length - 1}
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}