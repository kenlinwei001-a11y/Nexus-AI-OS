
import React from 'react';
import { StatusLevel } from '../types';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

// Color Mapping
export const getStatusColor = (status: StatusLevel) => {
  switch (status) {
    case StatusLevel.PROCESSING: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case StatusLevel.VERIFIED: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case StatusLevel.UNCERTAIN: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case StatusLevel.RISK: return 'text-red-400 bg-red-400/10 border-red-400/20';
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
};

export const getStatusLabel = (status: StatusLevel) => {
  switch (status) {
    case StatusLevel.PROCESSING: return '决策中';
    case StatusLevel.VERIFIED: return '已验证';
    case StatusLevel.UNCERTAIN: return '不确定';
    case StatusLevel.RISK: return '高风险';
  }
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, isLoading, ...props }) => {
  const baseStyle = "px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50";
  
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_10px_rgba(8,145,178,0.4)] border border-cyan-400/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600",
    danger: "bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-800",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200"
  };

  return (
    <button className={clsx(baseStyle, variants[variant], className)} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Badge: React.FC<{ status: StatusLevel; className?: string; children?: React.ReactNode }> = ({ status, className, children }) => {
  return (
    <span className={clsx("px-2 py-0.5 rounded text-xs font-mono border", getStatusColor(status), className)}>
      {children || getStatusLabel(status)}
    </span>
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, title, className, action, ...props }) => (
  <div className={clsx("glass-panel p-4 rounded-sm border border-slate-800/60", className)} {...props}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800/50">
        {title && <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider flex items-center gap-2 before:w-1 before:h-4 before:bg-cyan-500 before:block">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
);
