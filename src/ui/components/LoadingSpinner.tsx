type LoadingSpinnerProps = {
  label?: string;
};

export function LoadingSpinner({ label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <p role="status" aria-live="polite" style={{ color: "#6b7280", fontSize: 14 }}>
      {label}
    </p>
  );
}
