export default function Select({
  id,
  label,
  options,
  error,
  placeholder = "Selecciona una opción",
  ...props
}) {
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((op) => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="field-error" role="alert">{error}</p>
      )}
    </div>
  );
}