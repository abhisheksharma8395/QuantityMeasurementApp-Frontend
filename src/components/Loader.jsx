export default function Loader({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="loader-overlay" id="loader-overlay">
      <div className="loader-spinner"></div>
    </div>
  );
}
