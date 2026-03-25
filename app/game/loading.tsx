export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        <div className="space-y-2">
          <p className="text-slate-300 text-lg">Loading turn...</p>
          <p className="text-slate-500 text-sm">Generating AI narrative and artwork</p>
          <p className="text-slate-600 text-xs">This may take 5-15 seconds</p>
        </div>
      </div>
    </div>
  );
}
