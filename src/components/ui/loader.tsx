import { Loader2 } from "lucide-react";

const Loader = ({ size }: { size: "sm" | "lg" }) => {
  return (
    <Loader2
      color="blue"
      size={size === "lg" ? 40 : 25}
      className="animate-spin"
    />
  );
};

export default Loader;
