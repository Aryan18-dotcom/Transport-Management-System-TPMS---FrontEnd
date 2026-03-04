import { AlertTriangle } from "lucide-react";

function GlobalAlertBanner({ count }: { count: number }) {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertTriangle size={16} className="text-amber-500" />
        <p className="text-xs text-amber-200 font-medium tracking-tight">
          System Alert: <span className="font-bold">{count} Urgent Compliance</span> items require your attention.
        </p>
      </div>
      <button className="text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest">Review Now</button>
    </div>
  );
}

export default GlobalAlertBanner