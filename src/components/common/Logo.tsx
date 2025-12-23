import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="https://placehold.co/140x40/171717/FF9900/png?text=AI-NaMo" 
        alt="AI-NaMo Logo" 
        width={140} 
        height={40} 
        className="h-10 w-auto"
        priority
      />
    </div>
  );
};

export default Logo;
