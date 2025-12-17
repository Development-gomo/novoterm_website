export default function DotIndicator({ variant = "default" }) {
  const borderColor =
    variant === "white" ? "border-white" : "border-[#BFC5D1]";

  return (
    <div className="relative w-[16px] h-[16px] flex items-center justify-center">
      {/* Outer ring */}
      <div className={`absolute inset-0 rounded-full border ${borderColor}`} />

      {/* Inner dot */}
      <div className="w-[8px] h-[8px] rounded-full bg-[#2655C4]" />
    </div>
  );
}
