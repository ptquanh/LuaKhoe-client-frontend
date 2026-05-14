export const formatBold = (str: string) => {
  const parts = str.split("**");
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-[700] text-[#1B1B1B]">
          {part}
        </strong>
      );
    }
    return part;
  });
};

export const renderMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-3 text-[14px] leading-[1.6] text-[#5C5C5C]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        if (trimmed === "---") {
          return <hr key={idx} className="my-4 border-[#E0E0E0]" />;
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h4
              key={idx}
              className="mt-5 mb-2 text-[16px] font-[700] text-[#1B1B1B]"
            >
              {formatBold(trimmed.replace("## ", ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h3
              key={idx}
              className="mt-5 mb-2 text-[18px] font-[700] text-[#1B1B1B]"
            >
              {formatBold(trimmed.replace("# ", ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="text-[#2F9E44]">•</span>
              <span className="flex-1">
                {formatBold(trimmed.replace(/^- |\* /, ""))}
              </span>
            </div>
          );
        }
        return <p key={idx}>{formatBold(trimmed)}</p>;
      })}
    </div>
  );
};
