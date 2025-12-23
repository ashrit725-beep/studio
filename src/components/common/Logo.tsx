import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="https://storage.googleapis.com/project-1-122591624833290252/public/a2b534e6-d971-46f3-a16f-124b11f7278d.png" 
        alt="AI-NaMo Logo" 
        width={140} 
        height={140} 
        className="h-12 w-auto"
        priority
      />
    </div>
  );
};

export default Logo;
