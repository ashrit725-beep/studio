import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="text-2xl font-bold tracking-tighter text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-primary">
        AI-NaMo
      </span>
    </div>
  );
};

export default Logo;
