"use client";

import { userService } from "@/services/user.service";
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
        setShowBanModal(false);
        fetchUsers();
      } else {
        alert(res.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái người dùng:", error);
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
        setShowDeleteModal(false);
        setSelectedUserForDelete(null);
        fetchUsers();
      } else {
        alert(res.message || "Xóa người dùng thất bại");
      }
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error);
      alert("Đã xảy ra lỗi khi xóa người dùng");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-[700] text-[#1B1B1B]">
            Quản lý Người dùng
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C]">
            {loading ? "Đang tải..." : `${total} người dùng`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, email..."
              className="h-10 w-[240px] rounded-lg border border-[#E0E0E0] pr-4 pl-10 text-[14px] focus:border-[#2F9E44] focus:outline-none"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white px-3 text-[14px] text-[#1B1B1B] focus:border-[#2F9E44] focus:outline-none"
          >
            <option value="Tất cả">Tất cả vai trò</option>
            <option value="FARMER">Nông dân</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white px-3 text-[14px] text-[#1B1B1B] focus:border-[#2F9E44] focus:outline-none"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Chưa kích hoạt</option>
            <option value="SUSPENDED">Bị khóa</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0F2F5]">
              <th className="h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B]">
                Họ tên
              </th>
              <th className="hidden h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Username / Email
              </th>
              <th className="hidden h-12 px-4 text-left text-[13px] font-[600] text-[#1B1B1B] lg:table-cell">
                Tỉnh/TP
              </th>
              <th className="h-12 w-20 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Upload
              </th>
              <th className="hidden h-12 px-4 text-center text-[13px] font-[600] text-[#1B1B1B] md:table-cell">
                Ngày tham gia
              </th>
              <th className="h-12 w-28 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Trạng thái
              </th>
              <th className="h-12 w-36 px-4 text-center text-[13px] font-[600] text-[#1B1B1B]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="h-40 text-center text-[#5C5C5C]">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#2F9E44]" />
                  <p className="mt-2 text-[14px]">Đang tải danh sách...</p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="h-40 text-center text-[14px] text-[#5C5C5C]"
                >
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            ) : (
              users.map((u, i) => {
                const isBanned = u.status === "SUSPENDED";
                return (
                  <tr
                    key={u.id}
                    className={`h-12 border-t border-[#E0E0E0] hover:bg-[#F5F7F9] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}
                  >
                    <td className="px-4 py-3 align-middle text-[14px] font-[500] text-[#1B1B1B]">
                      {u.name}
                      {u.role === "ADMIN" && (
                        <span className="ml-1.5 rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-[600] text-[#2E7D32]">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 align-middle text-[13px] text-[#5C5C5C] md:table-cell">
                      <div className="font-mono text-[#1B1B1B]">
                        {u.username}
                      </div>
                      <div className="text-[11px] text-[#8C8C8C]">
                        {u.email}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 align-middle text-[14px] text-[#5C5C5C] lg:table-cell">
                      {u.province || "Chưa quét"}
                    </td>
                    <td className="px-4 py-3 text-center align-middle text-[14px] text-[#1B1B1B]">
                      {u.uploads}
                    </td>
                    <td className="hidden px-4 py-3 text-center align-middle text-[14px] text-[#5C5C5C] md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <span
                        title={u.metadata?.statusReason || ""}
                        className={`inline-flex h-6 items-center justify-center rounded-full px-2.5 text-[11px] font-[600] ${
                          isBanned
                            ? "bg-[#FFEBEE] text-[#C62828]"
                            : u.status === "ACTIVE"
                              ? "bg-[#E6F4EA] text-[#2E7D32]"
                              : "bg-[#F0F2F5] text-[#5C5C5C]"
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
                            className={`flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md px-2 text-[12px] font-[500] transition-colors ${isBanned ? "text-[#2E7D32] hover:bg-[#E6F4EA]" : "text-[#E53935] hover:bg-[#FFEBEE]"}`}
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
                            className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md px-2 text-[12px] font-[500] text-[#E53935] transition-colors hover:bg-[#FFEBEE]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Xóa
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[12px] text-[#5C5C5C]">
            Hiển thị {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} / {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 cursor-pointer rounded-md text-[14px] font-[500] ${p === page ? "bg-[#2F9E44] text-white" : "border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showBanModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[480px] rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-4">
              <h3 className="text-[16px] font-[700] text-[#1B1B1B]">
                {modalAction === "ban"
                  ? `Khóa tài khoản ${selectedUser.name}`
                  : `Mở khóa tài khoản ${selectedUser.name}`}
              </h3>
              <button
                onClick={() => setShowBanModal(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-[#F0F2F5]"
              >
                <X className="h-5 w-5 text-[#5C5C5C]" />
              </button>
            </div>
            <div className="px-6 py-5">
              <label className="mb-2 block text-[14px] font-[500] text-[#5C5C5C]">
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
                className="w-full resize-none rounded-lg border border-[#E0E0E0] px-3 py-2 text-[14px] focus:border-[#2F9E44] focus:outline-none"
              />
              <p className="mt-1.5 text-[12px] text-[#8C8C8C]">
                If left blank, the system will use the default reason.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#E0E0E0] px-6 py-4">
              <button
                onClick={() => setShowBanModal(false)}
                disabled={actionLoading}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] px-4 text-[14px] text-[#5C5C5C] hover:bg-[#F0F2F5] disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleStatusChange}
                disabled={actionLoading}
                className={`flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-4 text-[14px] font-[500] text-white hover:opacity-90 disabled:opacity-50 ${modalAction === "ban" ? "bg-[#E53935]" : "bg-[#2F9E44]"}`}
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
          <div className="w-full max-w-[440px] overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-xl">
            <div className="flex items-center gap-3 border-b border-[#E0E0E0] bg-[#FFF5F5] px-6 py-4">
              <AlertTriangle className="h-6 w-6 shrink-0 text-[#C62828]" />
              <h3 className="text-[16px] font-[700] text-[#C62828]">
                Xóa tài khoản vĩnh viễn
              </h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-[14px] leading-relaxed text-[#1B1B1B]">
                Bạn có chắc chắn muốn xóa tài khoản của người dùng{" "}
                <strong className="text-[#C62828]">
                  {selectedUserForDelete.name}
                </strong>{" "}
                ({selectedUserForDelete.email || selectedUserForDelete.username}
                )?
              </p>
              <div className="mt-3 rounded-lg border border-[#E0E0E0] bg-[#F9FAFB] p-3 text-[12px] leading-relaxed text-[#5C5C5C]">
                <span className="mb-1 block font-[600] text-[#C62828]">
                  Cảnh báo:
                </span>
                Hành động này **không thể hoàn tác**. Tất cả lịch sử chẩn đoán,
                dữ liệu ruộng đồng và liên kết tài khoản mạng xã hội của người
                dùng này sẽ bị **xóa sạch khỏi hệ thống**.
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#E0E0E0] bg-[#F9FAFB] px-6 py-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUserForDelete(null);
                }}
                disabled={actionLoading}
                className="h-10 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white px-4 text-[14px] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-[#C62828] px-4 text-[14px] font-[500] text-white shadow-sm transition-colors hover:bg-[#B71C1C] disabled:opacity-50"
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
