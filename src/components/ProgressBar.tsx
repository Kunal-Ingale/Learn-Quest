
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  showPercentage = true,
  size = 'md' 
}) => {
  const height = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <p className="text-sm font-medium">{label}</p>}
          {showPercentage && <p className="text-xs text-muted-foreground">{progress}%</p>}
        </div>
      )}
      <Progress value={progress} className={height} />
    </div>
  );
};

export default ProgressBar;
