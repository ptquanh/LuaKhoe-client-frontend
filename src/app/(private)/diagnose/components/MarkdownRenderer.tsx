export const formatBold = (str: string) => {
  const parts = str.split("**");
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-bold text-[var(--text-primary)]">
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
    <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        if (trimmed === "---") {
          return <hr key={idx} className="my-4 border-[var(--border)]" />;
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h4
              key={idx}
              className="mt-5 mb-2 text-base font-bold text-[var(--text-primary)]"
            >
              {formatBold(trimmed.replace("## ", ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h3
              key={idx}
              className="mt-5 mb-2 text-lg font-bold text-[var(--text-primary)]"
            >
              {formatBold(trimmed.replace("# ", ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="text-[var(--primary)]">•</span>
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
