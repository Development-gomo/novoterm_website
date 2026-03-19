export default function DotIndicator({ variant = "default" }) {
  let borderColor = "border-[#BFC5D1]";
  let dotColor = "bg-[#2655C4]";

  if (variant === "white") {
    borderColor = "border-white";
    dotColor = "bg-[#2655C4]";
  } else if (variant === "blue") {
    borderColor = "border-[#2655C4]";
    dotColor = "bg-[#2655C4]";
  } else if (variant === "gray") {
    borderColor = "border-gray-400";
    dotColor = "bg-gray-400";
  }

  return (
    <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
      {/* Outer ring: only show if not gray (active) */}
      {variant !== "gray" && (
        <div
          className={`absolute inset-0 rounded-full border ${borderColor} transition-all duration-300`}
        />
      )}

      {/* Inner dot */}
      <div
        className={`w-[6px] h-[6px] rounded-full ${dotColor} transition-all duration-300`}
      />
    </div>
  );
}
