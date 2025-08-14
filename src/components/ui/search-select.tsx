import React, { useState, useRef, useEffect } from "react";

interface SearchSelectProps<T> {
  items: T[];
  value: number;
  onSelect: (item: T) => void;
  onCreateNew?: () => void;
  error?: string;
  label: string;
  placeholder: string;
  noResultsText: string;
  createNewText?: string;
  getItemLabel: (item: T) => string;
  getItemId: (item: T) => number;
}

export function SearchSelect<T>({
  items,
  value,
  onSelect,
  onCreateNew,
  error,
  label,
  placeholder,
  noResultsText,
  createNewText,
  getItemLabel,
  getItemId,
}: SearchSelectProps<T>) {
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

  const filtered = items.filter((item) =>
    getItemLabel(item).toLowerCase().includes(search.toLowerCase())
  );

  const selected = items.find((item) => getItemId(item) === value);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div
        className={`w-full border rounded px-3 py-2 bg-white cursor-pointer ${
          error ? "border-danger-500" : "border-gray-300"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <span>
            {getItemLabel(selected)} ({getItemId(selected)})
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
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
              <div className="px-3 py-2 text-gray-500">{noResultsText}</div>
            )}
            {filtered.map((item) => (
              <div
                key={getItemId(item)}
                className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                  value === getItemId(item) ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <div className="font-medium">{getItemLabel(item)}</div>
                <div className="text-xs text-gray-500">
                  ID: {getItemId(item)}
                </div>
              </div>
            ))}
            {onCreateNew && createNewText && (
              <div
                className="px-3 py-2 text-blue-600 hover:bg-blue-50 cursor-pointer border-t border-gray-200"
                onClick={() => {
                  setOpen(false);
                  setSearch("");
                  onCreateNew();
                }}
              >
                + {createNewText}
              </div>
            )}
          </div>
        </div>
      )}
      {error && <div className="text-xs text-danger-500 mt-1">{error}</div>}
    </div>
  );
}
