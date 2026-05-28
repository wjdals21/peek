export function Input({ label, error, hint, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="label">{label}</label>}
      <input
        className={`field ${error ? 'field-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="flex items-center gap-1 text-2xs text-red-600">
          <i className="ti ti-alert-circle text-xs" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="flex items-center gap-1 text-2xs text-blue-500/50">
          <i className="ti ti-info-circle text-xs" />
          {hint}
        </p>
      )}
    </div>
  )
}

export function Textarea({ label, error, hint, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="label">{label}</label>}
      <textarea
        className={`field resize-none ${error ? 'field-error' : ''} ${className}`}
        rows={3}
        {...props}
      />
      {error && (
        <p className="flex items-center gap-1 text-2xs text-red-600">
          <i className="ti ti-alert-circle text-xs" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="flex items-center gap-1 text-2xs text-blue-500/50">
          <i className="ti ti-info-circle text-xs" />
          {hint}
        </p>
      )}
    </div>
  )
}
