import React, { useState, useRef, useEffect } from "react";
import { User } from "../../types";

interface UserSelectProps {
  users: User[];
  value: string;
  onSelect: (user: User) => void;
  error?: string;
  currentUser: User | null;
}

export function UserSelect({
  users,
  value,
  onSelect,
  error,
  currentUser,
}: UserSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Si el usuario no es admin, usar el usuario actual
  const isAdmin = currentUser?.role === "admin";
  const canEdit = isAdmin;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Si no es admin y no hay valor seleccionado, establecer el usuario actual
  useEffect(() => {
    if (!isAdmin && currentUser && !value) {
      onSelect(currentUser);
    }
  }, [isAdmin, currentUser, value, onSelect]);

  const filtered = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const selected = users.find((u) => u.id === value);

  // Si no es admin, mostrar solo el usuario actual
  const displayUsers = isAdmin ? filtered : currentUser ? [currentUser] : [];

  if (!canEdit) {
    return null;
  }

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium mb-1">Vendedor *</label>
      <div
        className={`w-full border rounded px-3 py-2 bg-white cursor-pointer"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <span>{selected.username}</span>
        ) : (
          <span className="text-gray-400">Selecciona un vendedor...</span>
        )}
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
          <input
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div>
            {displayUsers.length === 0 && (
              <div className="px-3 py-2 text-gray-500">
                No se encontraron vendedores
              </div>
            )}
            {displayUsers.map((user) => (
              <div
                key={user.id}
                className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                  value === user.id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  onSelect(user);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <div className="font-medium">{user.username}</div>
                <div className="text-xs text-gray-500">
                  {user.email} &bull; {user.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="text-xs text-danger-500 mt-1">{error}</div>}
    </div>
  );
}
