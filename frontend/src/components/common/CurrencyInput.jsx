import { useEffect, useRef } from "react";

const formatCurrencyValue = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const [integerPart = "0", decimalPart] = String(value).split(".");
  const integerDigits = integerPart.replace(/\D/g, "") || "0";
  const groupedInteger = integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return decimalPart === undefined
    ? groupedInteger
    : `${groupedInteger},${decimalPart.replace(/\D/g, "").slice(0, 2)}`;
};

const parseCurrencyValue = (displayValue) => {
  const sanitized = displayValue.replace(/[^\d,]/g, "");
  if (!sanitized) return "";

  const commaIndex = sanitized.lastIndexOf(",");
  if (commaIndex === -1) return sanitized.replace(/\D/g, "");

  const integerPart = sanitized.slice(0, commaIndex).replace(/\D/g, "") || "0";
  const decimalPart = sanitized.slice(commaIndex + 1).replace(/\D/g, "").slice(0, 2);
  return `${integerPart}.${decimalPart}`;
};

function CurrencyInput({ value, onValueChange, min, max, onBlur, ...props }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input || value === "") {
      input?.setCustomValidity("");
      return;
    }

    const numericValue = Number(value);
    if (min !== undefined && numericValue < Number(min)) {
      input.setCustomValidity(`El importe mínimo es ${formatCurrencyValue(Number(min).toFixed(2))}`);
    } else if (max !== undefined && numericValue > Number(max)) {
      input.setCustomValidity(`El importe máximo es ${formatCurrencyValue(Number(max).toFixed(2))}`);
    } else {
      input.setCustomValidity("");
    }
  }, [max, min, value]);

  const handleChange = (event) => {
    onValueChange(parseCurrencyValue(event.target.value));
  };

  const handleBlur = (event) => {
    if (value !== "" && Number.isFinite(Number(value))) {
      onValueChange(Number(value).toFixed(2));
    }
    onBlur?.(event);
  };

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={formatCurrencyValue(value)}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

export default CurrencyInput;
