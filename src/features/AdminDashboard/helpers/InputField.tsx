import React from 'react'
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const InputField = ({ label, icon, ...props }: InputProps) => {
  return (
    <div className="space-y-2 flex-1">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-tighter ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
        <input
          {...props}
          required
          className="w-full bg-neutral-950 border border-neutral-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-700 outline-none transition-all"
        />
      </div>
    </div>
  );
}

export default InputField