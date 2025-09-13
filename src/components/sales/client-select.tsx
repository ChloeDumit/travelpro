import { useState, useRef, useEffect, useMemo } from "react";
import { Client } from "../../types/client";

interface ClientSelectProps {
  clients: Client[];
  value: string;
  onSelect: (client: Client) => void;
  onCreateNew: () => void;
  error?: string;
  loading?: boolean;
}

export function ClientSelect({
  clients,
  value,
  onSelect,
  onCreateNew,
  error,
  loading = false,
}: ClientSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    return Array.isArray(clients)
      ? clients.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.clientId &&
              c.clientId.toLowerCase().includes(search.toLowerCase()))
        )
      : [];
  }, [clients, search]);

  const selected = Array.isArray(clients)
    ? clients.find((c) => c.id.toString() === value)
    : null;

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium mb-1">Cliente *</label>
      <div
        className={`w-full border rounded px-3 py-2 bg-white cursor-pointer ${
          error ? "border-danger-500" : "border-gray-300"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <span>
            {selected.name} ({selected.clientId})
          </span>
        ) : (
          <span className="text-gray-400">Selecciona un cliente...</span>
        )}
      </div>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
          <input
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
            placeholder="Buscar por nombre o RUT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div>
            {loading ? (
              <div className="px-3 py-2 text-gray-500">
                Cargando clientes...
              </div>
            ) : filtered.length === 0 && !loading ? (
              <div className="px-3 py-2 text-gray-500">
                No se encontraron clientes
              </div>
            ) : (
              filtered.map((client) => (
                <div
                  key={client.id}
                  className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                    value === client.id.toString() ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    onSelect(client);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <div className="font-medium">{client.name}</div>
                  <div className="text-xs text-gray-500">
                    {client.clientId} &bull; {client.email}
                  </div>
                </div>
              ))
            )}
            <div
              className="px-3 py-2 text-blue-600 hover:bg-blue-50 cursor-pointer border-t border-gray-200"
              onClick={() => {
                setOpen(false);
                setSearch("");
                onCreateNew();
              }}
            >
              + Crear nuevo cliente
            </div>
          </div>
        </div>
      )}
      {error && <div className="text-xs text-danger-500 mt-1">{error}</div>}
    </div>
  );
}
