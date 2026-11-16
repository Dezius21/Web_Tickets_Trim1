export default function Textarea({ id, label, error, ...props }) {
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="field-error" role="alert">{error}</p>
      )}
    </div>
  );
}