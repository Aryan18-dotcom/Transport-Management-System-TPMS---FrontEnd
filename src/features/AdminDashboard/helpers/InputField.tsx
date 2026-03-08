import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  className?: string; // 🔥 Added to allow grid control
}

const InputField = ({ label, icon, className, ...props }: InputProps) => {
  return (
    /* 🔥 Apply className here so it affects the Grid Layout */
    <div className={`space-y-2 flex-1 ${className || ""}`}>
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full bg-neutral-950 border border-neutral-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 rounded-2xl ${icon ? 'pl-12' : 'px-5'} pr-4 py-3.5 text-xs font-bold text-white placeholder-zinc-700 outline-none transition-all`}
        />
      </div>
    </div>
  );
}

export default InputField;