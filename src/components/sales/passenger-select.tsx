import { useState, useRef, useEffect } from "react";
import { Passenger } from "../../types";
import { Badge } from "../ui/badge";
import { X, ChevronDown, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

interface PassengerSelectProps {
  items: Passenger[];
  value: Passenger[];
  onSelect: (passengers: Passenger[]) => void;
  error?: string;
  label: string;
  placeholder: string;
  noResultsText: string;
  getItemLabel: (passenger: Passenger) => string;
  getItemId: (passenger: Passenger) => string;
}

export default function PassengerSelect({
  items,
  value = [],
  onSelect,
  error,
  label,
  placeholder,
  noResultsText,
  getItemLabel,
  getItemId,
}: PassengerSelectProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [createPassengerModal, setCreatePassengerModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePassengerSelect = (passenger: Passenger) => {
    // Check if passenger is already selected
    const isAlreadySelected = value.some(
      (p) => getItemId(p) === getItemId(passenger)
    );

    if (!isAlreadySelected) {
      const newPassengers = [...value, passenger];

      onSelect(newPassengers);
    } else {
      console.error("Passenger already selected:", passenger);
    }

    // Keep dropdown open for multiple selections
    setSearchValue("");
  };

  const handlePassengerRemove = (passengerId: string) => {
    const newPassengers = value.filter((p) => getItemId(p) !== passengerId);
    onSelect(newPassengers);
  };

  // Simple filtering: show all items that match search and aren't selected
  const availablePassengers = items.filter((item) => {
    const isSelected = value.some(
      (selected) => getItemId(selected) === getItemId(item)
    );
    const matchesSearch =
      searchValue === "" ||
      getItemLabel(item).toLowerCase().includes(searchValue.toLowerCase());
    return !isSelected && matchesSearch;
  });

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCreatePassengerModal(true)}
          >
            <Plus className="h-4 w-4" />
            Agregar nuevo pasajero
          </Button>
        </div>
      </div>

      {/* Selected passengers display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((passenger) => (
            <Badge
              key={getItemId(passenger)}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {getItemLabel(passenger)}
              <button
                type="button"
                onClick={() => handlePassengerRemove(getItemId(passenger))}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Custom dropdown for adding new passengers */}
      <div className="relative" ref={dropdownRef}>
        <div
          className={`w-full border rounded-md px-3 py-2 bg-white cursor-pointer flex items-center justify-between ${
            error ? "border-danger-500" : "border-gray-300"
          } ${isOpen ? "ring-2 ring-primary-500 border-primary-500" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={value.length === 0 ? "text-gray-400" : "text-gray-900"}
          >
            {value.length === 0
              ? placeholder
              : `${value.length} pasajero(s) seleccionado(s)`}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
              <input
                className="flex-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Buscar pasajeros..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              {availablePassengers.length === 0 && (
                <div className="px-3 py-2 text-gray-500">
                  {searchValue
                    ? noResultsText
                    : value.length === 0
                    ? "No hay pasajeros disponibles"
                    : "Todos los pasajeros disponibles han sido seleccionados"}
                </div>
              )}
              {availablePassengers.map((passenger) => (
                <div
                  key={getItemId(passenger)}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handlePassengerSelect(passenger)}
                >
                  <div className="font-medium">{getItemLabel(passenger)}</div>
                  <div className="text-xs text-gray-500">
                    ID: {getItemId(passenger)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}
