import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="text-2xl font-bold tracking-tighter text-foreground">
        <span style={{ color: 'hsl(var(--accent))' }}>AI</span>
        <span style={{ color: 'hsl(var(--primary))' }}>-NaMo</span>
      </span>
    </div>
  );
};

export default Logo;
