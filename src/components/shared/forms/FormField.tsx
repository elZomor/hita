interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 animate-fadeIn">{error}</p>
      )}
    </div>
  );
}
