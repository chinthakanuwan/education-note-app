'use client';

import { useState, useRef } from 'react';

export default function Camera({ onCapture, onCancel, loading }) {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (image) {
      onCapture(image);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Capture Textbook Page</h3>
      
      {!image ? (
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition"
          >
            <p className="text-gray-600">📷 Click to capture or upload image</p>
          </button>
        </div>
      ) : (
        <div>
          <img src={image} alt="Captured" className="w-full rounded-lg mb-4" />
          <div className="flex gap-3">
            <button
              onClick={handleCapture}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Processing...' : 'Generate Note'}
            </button>
            <button
              onClick={() => setImage(null)}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Retake
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={onCancel}
        className="w-full mt-3 text-gray-500 hover:text-gray-700 transition"
      >
        Cancel
      </button>
    </div>
  );
}