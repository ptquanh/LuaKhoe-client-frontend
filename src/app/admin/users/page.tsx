"use client";

import { message } from "antd";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Shield,
  ShieldOff,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { userService } from "@/services/user.service";

interface UserItem {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  uploads: number;
  province: string;
  metadata?: Record<string, any>;
}

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  // Ban/Unban Modal states
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [banReason, setBanReason] = useState("");
  const [modalAction, setModalAction] = useState<"ban" | "unban">("ban");
  const [actionLoading, setActionLoading] = useState(false);

  // Delete Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] =
    useState<UserItem | null>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const keywordParam =
        debouncedSearch.trim().length > 0 && debouncedSearch.trim().length < 3
          ? undefined
          : debouncedSearch.trim() || undefined;

      const res = await userService.getUsersForAdmin({
        keyword: keywordParam,
        role: roleFilter !== "Tất cả" ? roleFilter : undefined,
        status: statusFilter !== "Tất cả" ? statusFilter : undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });
      if (res.success && res.data) {
        setUsers(res.data.rows);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, page, roleFilter, statusFilter]);

  const openActionModal = (user: UserItem, action: "ban" | "unban") => {
    setSelectedUser(user);
    setModalAction(action);
    setBanReason("");
    setShowBanModal(true);
  };

  const handleStatusChange = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const newStatus = modalAction === "ban" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await userService.updateUserStatusForAdmin(selectedUser.id, {
        status: newStatus,
        reason: banReason.trim() || undefined,
      });
      if (res.success) {
        message.success(
          modalAction === "ban"
            ? "Đã khóa tài khoản thành công."
            : "Đã mở khóa tài khoản thành công.",
        );
        setShowBanModal(false);
        fetchUsers();
      } else {
        message.error(res.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái người dùng:", error);
      message.error("Đã xảy ra lỗi khi cập nhật trạng thái");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserForDelete) return;
    setActionLoading(true);
    try {
      const res = await userService.deleteUserForAdmin(
        selectedUserForDelete.id,
      );
      if (res.success) {
        message.success("Đã xóa người dùng thành công.");
        setShowDeleteModal(false);
        setSelectedUserForDelete(null);
        fetchUsers();
      } else {
        message.error(res.message || "Xóa người dùng thất bại");
      }
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error);
      message.error("Đã xảy ra lỗi khi xóa người dùng");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="Quản lý Người dùng"
        description={loading ? "Đang tải..." : `${total} người dùng`}
        actions={
          <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:w-[220px] sm:flex-none">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên, email..."
                className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pr-4 pl-10 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
            >
              <option value="Tất cả">Tất cả vai trò</option>
              <option value="FARMER">Nông dân</option>
              <option value="ADMIN">Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-base text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Chưa kích hoạt</option>
              <option value="SUSPENDED">Bị khóa</option>
            </select>
          </div>
        }
      />

      {loading ? (
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="Không tìm thấy người dùng nào"
          description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
        />
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {users.map((u) => {
              const isBanned = u.status === "SUSPENDED";
              return (
                <div
                  key={u.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {u.name}
                        </span>
                        {u.role === "ADMIN" && (
                          <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-[var(--text-secondary)]">
                        @{u.username}
                      </p>
                      <p className="truncate text-xs text-[var(--text-muted)]">
                        {u.email}
                      </p>
                    </div>
                    <span
                      title={u.metadata?.statusReason || ""}
                      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        isBanned
                          ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                          : u.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-[var(--bg-subtle)] text-[var(--text-muted)]"
                      }`}
                    >
                      {isBanned
                        ? "Bị khóa"
                        : u.status === "ACTIVE"
                          ? "Hoạt động"
                          : "Chưa kích hoạt"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)] tabular-nums">
                    <span>
                      Upload: {u.uploads} · {u.province || "Chưa quét"}
                    </span>
                    {u.role !== "ADMIN" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            openActionModal(u, isBanned ? "unban" : "ban")
                          }
                          className={`flex min-h-9 cursor-pointer items-center gap-1 rounded-lg border px-2.5 text-xs font-medium ${
                            isBanned
                              ? "border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400"
                              : "border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
                          }`}
                        >
                          {isBanned ? (
                            <Shield className="h-3.5 w-3.5" />
                          ) : (
                            <ShieldOff className="h-3.5 w-3.5" />
                          )}
                          {isBanned ? "Mở" : "Khóa"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserForDelete(u);
                            setShowDeleteModal(true);
                          }}
                          className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg border border-red-200 px-2.5 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                  <th className="h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Họ tên
                  </th>
                  <th className="h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)]">
                    Username / Email
                  </th>
                  <th className="hidden h-12 px-4 text-left text-[13px] font-semibold text-[var(--text-primary)] lg:table-cell">
                    Tỉnh/TP
                  </th>
                  <th className="h-12 w-20 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                    Upload
                  </th>
                  <th className="h-12 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                    Ngày tham gia
                  </th>
                  <th className="h-12 w-28 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                    Trạng thái
                  </th>
                  <th className="h-12 w-36 px-4 text-center text-[13px] font-semibold text-[var(--text-primary)]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isBanned = u.status === "SUSPENDED";
                  return (
                    <tr
                      key={u.id}
                      className="h-14 border-t border-[var(--border)] transition-colors hover:bg-[var(--bg-hover)]"
                    >
                      <td className="px-4 py-3 align-middle text-sm font-medium text-[var(--text-primary)]">
                        {u.name}
                        {u.role === "ADMIN" && (
                          <span className="ml-1.5 rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] text-[var(--text-secondary)]">
                        <div className="font-mono text-[var(--text-primary)]">
                          {u.username}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {u.email}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 align-middle text-sm text-[var(--text-secondary)] lg:table-cell">
                        {u.province || "Chưa quét"}
                      </td>
                      <td className="px-4 py-3 text-center align-middle text-sm text-[var(--text-primary)] tabular-nums">
                        {u.uploads}
                      </td>
                      <td className="px-4 py-3 text-center align-middle text-sm text-[var(--text-secondary)] tabular-nums">
                        {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 text-center align-middle">
                        <span
                          title={u.metadata?.statusReason || ""}
                          className={`inline-flex h-6 items-center justify-center rounded-full px-2.5 text-[11px] font-semibold ${
                            isBanned
                              ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                              : u.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : "bg-[var(--bg-subtle)] text-[var(--text-muted)]"
                          }`}
                        >
                          {isBanned
                            ? "Bị khóa"
                            : u.status === "ACTIVE"
                              ? "Hoạt động"
                              : "Chưa kích hoạt"}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        {u.role !== "ADMIN" && (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                openActionModal(u, isBanned ? "unban" : "ban")
                              }
                              className={`flex min-h-9 cursor-pointer items-center justify-center gap-1 rounded-lg px-2.5 text-xs font-medium transition-colors ${
                                isBanned
                                  ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                  : "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                              }`}
                            >
                              {isBanned ? (
                                <Shield className="h-3.5 w-3.5" />
                              ) : (
                                <ShieldOff className="h-3.5 w-3.5" />
                              )}
                              {isBanned ? "Mở" : "Khóa"}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUserForDelete(u);
                                setShowDeleteModal(true);
                              }}
                              className="flex min-h-9 cursor-pointer items-center justify-center gap-1 rounded-lg px-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Xóa
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)] tabular-nums">
            Hiển thị {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} / {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-10 min-w-10 cursor-pointer rounded-lg px-2 text-sm font-medium tabular-nums ${p === page ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showBanModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[480px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {modalAction === "ban"
                  ? `Khóa tài khoản ${selectedUser.name}`
                  : `Mở khóa tài khoản ${selectedUser.name}`}
              </h3>
              <button
                onClick={() => setShowBanModal(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                Lý do thay đổi trạng thái (tùy chọn)
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder={
                  modalAction === "ban"
                    ? "Nhập lý do khóa (Ví dụ: Đăng tải ảnh không hợp lệ)..."
                    : "Nhập lý do mở khóa..."
                }
                rows={3}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
              />
              <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                Nếu bỏ trống, hệ thống sẽ áp dụng lý do mặc định.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--border)] px-6 py-4">
              <button
                onClick={() => setShowBanModal(false)}
                disabled={actionLoading}
                className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleStatusChange}
                disabled={actionLoading}
                className={`flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 ${modalAction === "ban" ? "bg-red-600" : "bg-[var(--primary)]"}`}
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedUserForDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl">
            <div className="flex items-center gap-3 border-b border-[var(--border)] bg-red-50/70 px-6 py-4 dark:bg-red-950/30">
              <AlertTriangle className="h-6 w-6 shrink-0 text-red-600 dark:text-red-400" />
              <h3 className="text-base font-bold text-red-700 dark:text-red-300">
                Xóa tài khoản vĩnh viễn
              </h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                Bạn có chắc chắn muốn xóa tài khoản của người dùng{" "}
                <strong className="text-red-600 dark:text-red-400">
                  {selectedUserForDelete.name}
                </strong>{" "}
                ({selectedUserForDelete.email || selectedUserForDelete.username}
                )?
              </p>
              <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                <span className="mb-1 block font-semibold text-red-600 dark:text-red-400">
                  Cảnh báo:
                </span>
                Hành động này không thể hoàn tác. Tất cả lịch sử chẩn đoán, dữ
                liệu ruộng đồng và liên kết tài khoản mạng xã hội của người dùng
                này sẽ bị xóa sạch khỏi hệ thống.
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUserForDelete(null);
                }}
                disabled={actionLoading}
                className="min-h-11 cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl bg-red-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
