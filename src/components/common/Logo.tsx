import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="https://storage.googleapis.com/aifire-6e5ac.appspot.com/users%2FwB8o2BsnF5fGj9bE3sOVFx1t3913%2Fprojects%2Fdefault%2Flogo.png" 
        alt="AI-NaMo Logo" 
        width={140} 
        height={40} 
        className="h-10 w-auto"
      />
    </div>
  );
};

export default Logo;
