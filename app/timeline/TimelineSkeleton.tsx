export default function () {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-neutral-800 rounded animate-pulse" />
      ))}
    </div>
  );
}
