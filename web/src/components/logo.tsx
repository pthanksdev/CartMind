import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const Logo = ({
  className,
  to = "/",
  showText = true,
}: {
  className?: string;
  to?: string;
  showText?: boolean;
}) => {
  return (
    <Link to={to} className={cn("flex items-center gap-2 font-medium", className)}>
      <div className="size-8">
        <img src={logo} alt="CartMind AI" className="size-full object-contain" />
      </div>
      {showText && (
        <span className="text-[22px] font-extrabold tracking-tight dark:text-white flex items-center gap-1">
          Cart<span className="text-primary">Mind</span>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">
            AI
          </span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
