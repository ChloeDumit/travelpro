import React, { useState, useRef, useEffect } from "react";
import { Supplier } from "../../types/supplier";

interface SupplierSelectProps {
  suppliers: Supplier[];
  value: number; // Cambiado de string a number
  onSelect: (supplier: Supplier) => void;
  error?: string;
}

export function SupplierSelect({
  suppliers,
  value,
  onSelect,
  error,
}: SupplierSelectProps) {
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

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = suppliers.find((s) => s.id === value);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium mb-1">Proveedor</label>
      <div
        className={`w-full border rounded px-3 py-2 bg-white cursor-pointer ${
          error ? "border-danger-500" : "border-gray-300"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <span>
            {selected.name} ({selected.id})
          </span>
        ) : (
          <span className="text-gray-400">Selecciona un proveedor...</span>
        )}
      </div>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
          <input
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div>
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-gray-500">
                No se encontraron proveedores
              </div>
            )}
            {filtered.map((supplier) => (
              <div
                key={supplier.id}
                className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                  value === supplier.id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  onSelect(supplier);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <div className="font-medium">{supplier.name}</div>
                <div className="text-xs text-gray-500">ID: {supplier.id}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <div className="text-xs text-danger-500 mt-1">{error}</div>}
    </div>
  );
}
