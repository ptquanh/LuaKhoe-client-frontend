import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
} from "lucide-react";

interface PostStatusBadgeProps {
  status?: string;
  className?: string;
}

export default function PostStatusBadge({
  status,
  className = "",
}: PostStatusBadgeProps) {
  const normalizedStatus = status?.toUpperCase() || "";

  switch (normalizedStatus) {
    case "APPROVED":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 ${className}`}
        >
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Đã đăng
        </span>
      );
    case "PENDING":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 ${className}`}
        >
          <Clock className="h-3 w-3" aria-hidden="true" /> Chờ duyệt
        </span>
      );
    case "DRAFT":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 ${className}`}
        >
          <FileText className="h-3 w-3" aria-hidden="true" /> Bản nháp
        </span>
      );
    case "REJECTED":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 ${className}`}
        >
          <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Từ chối
        </span>
      );
    case "EXPIRED":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-800 ${className}`}
        >
          <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Hết hạn
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500 ${className}`}
        >
          <HelpCircle className="h-3 w-3" aria-hidden="true" /> Không xác định
        </span>
      );
  }
}
