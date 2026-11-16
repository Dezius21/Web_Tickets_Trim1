export default function Select({ id, label, options, error, ...props }) {
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
        <option value="">Selecciona una opción</option>
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