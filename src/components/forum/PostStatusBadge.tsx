import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";

interface PostStatusBadgeProps {
  status?: string;
  rejectedBy?: "AI" | "ADMIN" | null;
  className?: string;
}

export default function PostStatusBadge({
  status,
  rejectedBy,
  className = "",
}: PostStatusBadgeProps) {
  const normalizedStatus = status?.toUpperCase() || "";

  switch (normalizedStatus) {
    case "APPROVED":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300 ${className}`}
        >
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Đã đăng
        </span>
      );
    case "PENDING":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-300 ${className}`}
        >
          <Clock className="h-3 w-3" aria-hidden="true" /> Chờ duyệt
        </span>
      );
    case "DRAFT":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)] ${className}`}
        >
          <FileText className="h-3 w-3" aria-hidden="true" /> Bản nháp
        </span>
      );
    case "REJECTED":
      if (rejectedBy === "AI") {
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900 dark:border-amber-700/70 dark:bg-amber-950/60 dark:text-amber-300 ${className}`}
          >
            <Bot className="h-3.5 w-3.5" aria-hidden="true" /> Từ chối tự động
            (AI)
          </span>
        );
      }
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:border-red-800/70 dark:bg-red-950/60 dark:text-red-300 ${className}`}
        >
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" /> Từ chối
          (Ban Quản Trị)
        </span>
      );
    case "EXPIRED":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-[var(--border-strong)] bg-[var(--bg-subtle)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)] ${className}`}
        >
          <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Hết hạn
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-muted)] ${className}`}
        >
          <HelpCircle className="h-3 w-3" aria-hidden="true" /> Không xác định
        </span>
      );
  }
}
