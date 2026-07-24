import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import "./SearchableSelect.css";

const normalizeSearch = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("es");

function SearchableSelect({
  name,
  value,
  options,
  onValueChange,
  ariaLabel,
  placeholder,
  emptyMessage = "No hay coincidencias",
  required = false,
  autoFocus = false
}) {
  const generatedId = useId();
  const inputId = `${name}-${generatedId}`;
  const listId = `${inputId}-options`;
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedOption = options.find((option) => String(option.value) === String(value));
  const selectedLabel = selectedOption?.selectionLabel || selectedOption?.label || "";
  const effectiveQuery = selectedOption && query === selectedLabel ? "" : query;
  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeSearch(effectiveQuery.trim());
    if (!normalizedQuery) return options;

    return options.filter((option) => normalizeSearch(
      option.searchText || `${option.label} ${option.detail || ""}`
    ).includes(normalizedQuery));
  }, [effectiveQuery, options]);

  useEffect(() => {
    if (!open) setQuery(selectedLabel);
  }, [open, selectedLabel]);

  useEffect(() => {
    inputRef.current?.setCustomValidity(
      required && !value ? "Seleccioná una opción de la lista" : ""
    );
  }, [required, value]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectOption = (option) => {
    onValueChange(String(option.value));
    setQuery(option.selectionLabel || option.label);
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.focus();
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    onValueChange("");
    setOpen(true);
    setActiveIndex(0);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => open
        ? Math.min(current + 1, Math.max(filteredOptions.length - 1, 0))
        : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && open && filteredOptions[activeIndex]) {
      event.preventDefault();
      selectOption(filteredOptions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery(selectedLabel);
    }
  };

  return (
    <div className={`searchable-select${open ? " is-open" : ""}`} ref={wrapperRef}>
      <FiSearch className="searchable-select-search" aria-hidden="true" />
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-label={ariaLabel}
        aria-controls={listId}
        aria-expanded={open}
        aria-activedescendant={open && filteredOptions[activeIndex] ? `${listId}-${filteredOptions[activeIndex].value}` : undefined}
        value={query}
        onChange={handleInputChange}
        onFocus={(event) => {
          setOpen(true);
          setActiveIndex(0);
          event.target.select();
        }}
        onKeyDown={handleKeyDown}
        onInvalid={() => setOpen(true)}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
      />
      <input type="hidden" name={name} value={value} />
      <button
        className="searchable-select-toggle"
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false);
            setQuery(selectedLabel);
          } else {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
        aria-label={open ? "Cerrar opciones" : "Mostrar opciones"}
        title={open ? "Cerrar opciones" : "Mostrar opciones"}
      >
        <FiChevronDown />
      </button>

      {open && (
        <div className="searchable-select-menu" id={listId} role="listbox">
          {filteredOptions.length ? filteredOptions.map((option, index) => (
            <button
              id={`${listId}-${option.value}`}
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              role="option"
              aria-selected={String(option.value) === String(value)}
              key={option.value}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                selectOption(option);
              }}
            >
              <strong>{option.label}</strong>
              {option.detail && <small>{option.detail}</small>}
            </button>
          )) : (
            <p>{emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
