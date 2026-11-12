'use client';

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">📚 Education Notes</h1>
        <div className="flex items-center gap-3">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-8 h-8 rounded-full"
          />
          <button
            onClick={onLogout}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}