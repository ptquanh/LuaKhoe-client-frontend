"use client";

import PostStatusBadge from "@/components/forum/PostStatusBadge";
import { useAdminConfigs } from "@/hooks/useAdminConfigs";
import { useForumPosts, useModeratePost } from "@/hooks/useForum";
import { adminService } from "@/services/admin.service";
import { SYSTEM_CONFIG_KEY } from "@/types/admin.type";
import { SafetyCertificateOutlined, SettingOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  Switch,
  Tabs,
  Typography,
} from "antd";

import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  MessageSquare,
  Shield,
  Tag,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const { TextArea } = Input;
type StatusTab = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

export default function AdminForumModeration() {
  const { message, modal } = App.useApp();
  const [activeSubTab, setActiveSubTab] = useState<StatusTab>("PENDING");
  const [bannedWords, setBannedWords] = useState<string[]>([
    "chửi thề",
    "thuốc giả",
    "lừa đảo",
  ]);

  const { configs = [], addConfig, updateConfig } = useAdminConfigs();

  const aiEnabledConfig = configs.find(
    (c) => c.key === SYSTEM_CONFIG_KEY.AI_AUTO_MODERATION_ENABLED,
  );
  const postRolesConfig = configs.find(
    (c) => c.key === SYSTEM_CONFIG_KEY.AI_MODERATION_POST_ROLES,
  );
  const commentRolesConfig = configs.find(
    (c) => c.key === SYSTEM_CONFIG_KEY.AI_MODERATION_COMMENT_ROLES,
  );
  const cronEnabledConfig = configs.find(
    (c) => c.key === SYSTEM_CONFIG_KEY.AI_CRON_MODERATION_ENABLED,
  );
  const cronDelayConfig = configs.find(
    (c) => c.key === SYSTEM_CONFIG_KEY.AI_CRON_DELAY_MINUTES,
  );

  const parseRoles = (config: any) => {
    if (!config) return [];
    try {
      const parsed = JSON.parse(config.value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return config.value
        ? config.value.split(",").map((s: string) => s.trim())
        : [];
    }
  };

  const aiConfig = {
    isEnabled: aiEnabledConfig ? aiEnabledConfig.value === "true" : false,
    postRoles: parseRoles(postRolesConfig),
    commentRoles: parseRoles(commentRolesConfig),
    isCronEnabled: cronEnabledConfig
      ? cronEnabledConfig.value === "true"
      : false,
    cronDelay: cronDelayConfig ? parseInt(cronDelayConfig.value, 10) || 15 : 15,
  };

  const handleUpdateConfigKey = async (
    key: SYSTEM_CONFIG_KEY,
    value: string,
    description: string,
    successMessage: string,
  ) => {
    try {
      const existing = configs.find((c) => c.key === key);
      if (existing) {
        await updateConfig({
          key,
          payload: { value, description },
        });
      } else {
        await addConfig({
          key,
          value,
          description,
        });
      }
      message.success(successMessage);
    } catch (err) {
      console.error(`Lỗi khi lưu cấu hình ${key}:`, err);
      message.error("Có lỗi xảy ra khi cập nhật cấu hình.");
    }
  };

  const handleUpdateRealtimeEnabled = (checked: boolean) =>
    handleUpdateConfigKey(
      SYSTEM_CONFIG_KEY.AI_AUTO_MODERATION_ENABLED,
      checked ? "true" : "false",
      "Trạng thái AI Kiểm duyệt Bài viết & Bình luận trực tiếp",
      "Cập nhật trạng thái AI Kiểm duyệt thành công!",
    );

  const handleUpdatePostRoles = (roles: string[]) =>
    handleUpdateConfigKey(
      SYSTEM_CONFIG_KEY.AI_MODERATION_POST_ROLES,
      JSON.stringify(roles),
      "Các nhóm vai trò bị kiểm duyệt bài viết tự động",
      "Cập nhật vai trò kiểm duyệt bài viết thành công!",
    );

  const handleUpdateCommentRoles = (roles: string[]) =>
    handleUpdateConfigKey(
      SYSTEM_CONFIG_KEY.AI_MODERATION_COMMENT_ROLES,
      JSON.stringify(roles),
      "Các nhóm vai trò bị kiểm duyệt bình luận tự động",
      "Cập nhật vai trò kiểm duyệt bình luận thành công!",
    );

  const handleUpdateCronEnabled = (checked: boolean) =>
    handleUpdateConfigKey(
      SYSTEM_CONFIG_KEY.AI_CRON_MODERATION_ENABLED,
      checked ? "true" : "false",
      "Bật tắt Cron Job AI kiểm duyệt chạy nền",
      "Cập nhật trạng thái Cron Job thành công!",
    );

  const handleUpdateCronDelay = (value: number) =>
    handleUpdateConfigKey(
      SYSTEM_CONFIG_KEY.AI_CRON_DELAY_MINUTES,
      String(value),
      "Số phút trễ trước khi quét các bài viết/bình luận PENDING",
      "Cập nhật thời gian quét chạy nền thành công!",
    );

  // Modal states for manual rejection reason
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const moderatePostMutation = useModeratePost();

  // Fetch posts of the active status sub-tab
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useForumPosts({
    status: activeSubTab,
    limit: 10,
  });

  useEffect(() => {
    const fetchBannedWords = async () => {
      try {
        const response = await adminService.getBannedWords();
        if (response?.success && response?.data) {
          const { value } = response.data;
          if (value) {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              setBannedWords(parsed);
            }
          }
        }
      } catch (err) {
        // Fallback to defaults
      }
    };
    fetchBannedWords();
  }, []);

  const handleApprove = async (id: string) => {
    modal.confirm({
      title: "Phê duyệt bài viết",
      content: "Bạn có chắc chắn muốn duyệt đăng bài viết này công khai không?",
      okText: "Duyệt đăng",
      okType: "primary",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await moderatePostMutation.mutateAsync({
            id,
            status: "APPROVED",
            flaggedReason: "",
          });
          message.success("Bài viết đã được duyệt công khai thành công!");
          refetch();
        } catch (err: any) {
          message.error(err.message || "Có lỗi xảy ra khi phê duyệt bài viết.");
        }
      },
    });
  };

  const handleRejectClick = (id: string) => {
    setSelectedPostId(id);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedPostId) return;
    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      message.error("Vui lòng nhập lý do từ chối bài viết!");
      return;
    }

    try {
      await moderatePostMutation.mutateAsync({
        id: selectedPostId,
        status: "REJECTED",
        flaggedReason: trimmedReason,
      });
      message.warning("Bài viết đã bị từ chối.");
      setIsRejectModalOpen(false);
      refetch();
    } catch (err: any) {
      message.error(err.message || "Có lỗi xảy ra khi từ chối bài viết.");
    }
  };

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.items || []) || [];
  }, [data]);

  // Highlight matched banned keywords
  const highlightBannedWords = (content: string) => {
    if (!bannedWords || bannedWords.length === 0) return <span>{content}</span>;

    const escapedWords = bannedWords
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .filter((w) => w.length > 0);

    if (escapedWords.length === 0) return <span>{content}</span>;

    const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");
    const parts = content.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="mx-0.5 rounded border border-red-200 bg-red-100 px-1.5 py-0.5 text-[14px] font-[600] text-red-600 shadow-xs"
            >
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Kiểm duyệt Nội dung tự động */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="mr-2 text-lg text-emerald-600" />
            <span className="font-semibold text-gray-800">
              AI Kiểm duyệt Nội dung tự động
            </span>
          </div>
        }
        extra={
          <SettingOutlined className="cursor-pointer text-gray-400 transition-colors hover:text-emerald-600" />
        }
        className="mb-6 border border-gray-200 bg-emerald-50/10 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Cấu hình Lọc Trực Tiếp (Realtime) */}
          <div className="border-gray-150 flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="m-0 flex items-center gap-1.5 text-[14px] font-semibold text-emerald-800">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Lọc trực tiếp (Realtime)
                </h4>
                <Typography.Text type="secondary" className="text-xs">
                  AI quét bài và bình luận khi người dùng đăng bài
                </Typography.Text>
              </div>
              <Switch
                checked={aiConfig.isEnabled}
                onChange={handleUpdateRealtimeEnabled}
                checkedChildren="BẬT"
                unCheckedChildren="TẮT"
                className={
                  aiConfig.isEnabled ? "bg-emerald-500" : "bg-gray-300"
                }
              />
            </div>

            <hr className="my-1 border-gray-100" />

            <div>
              <h5 className="mb-2 text-xs font-semibold text-gray-700">
                Nhóm bị AI kiểm duyệt Bài viết (Post):
              </h5>
              <Select
                mode="multiple"
                allowClear
                className="w-full"
                placeholder="Chọn nhóm bị kiểm duyệt Post"
                value={aiConfig.postRoles}
                onChange={handleUpdatePostRoles}
                options={[
                  { label: "Nông dân (FARMER)", value: "FARMER" },
                  { label: "Quản trị viên (ADMIN)", value: "ADMIN" },
                ]}
              />
            </div>

            <div>
              <h5 className="mb-2 text-xs font-semibold text-gray-700">
                Nhóm bị AI kiểm duyệt Bình luận (Comment):
              </h5>
              <Select
                mode="multiple"
                allowClear
                className="w-full"
                placeholder="Chọn nhóm bị kiểm duyệt Comment"
                value={aiConfig.commentRoles}
                onChange={handleUpdateCommentRoles}
                options={[
                  { label: "Nông dân (FARMER)", value: "FARMER" },
                  { label: "Quản trị viên (ADMIN)", value: "ADMIN" },
                ]}
              />
            </div>
          </div>

          {/* Cấu hình Quét Chạy Nền (Cron Job) */}
          <div className="border-gray-155 flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="m-0 flex items-center gap-1.5 text-[14px] font-semibold text-emerald-800">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  Quét định kỳ chạy nền (Cron Job)
                </h4>
                <Typography.Text type="secondary" className="text-xs">
                  Tự động quét lại bài đăng/bình luận chờ duyệt quá{" "}
                  {aiConfig.cronDelay} phút
                </Typography.Text>
              </div>
              <Switch
                checked={aiConfig.isCronEnabled}
                onChange={handleUpdateCronEnabled}
                checkedChildren="BẬT"
                unCheckedChildren="TẮT"
                className={
                  aiConfig.isCronEnabled ? "bg-emerald-500" : "bg-gray-300"
                }
              />
            </div>

            <hr className="my-1 border-gray-100" />

            <div className="flex flex-col gap-2">
              <h5 className="text-xs font-semibold text-gray-700">
                Thời gian trễ tối thiểu trước khi quét (phút):
              </h5>
              <div className="flex items-center gap-3">
                <Space.Compact>
                  <InputNumber
                    min={1}
                    max={1440}
                    value={aiConfig.cronDelay}
                    onChange={(val) => val && handleUpdateCronDelay(val)}
                    className="w-32"
                  />
                  <Button disabled className="pointer-events-none">
                    phút
                  </Button>
                </Space.Compact>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Hệ thống chạy tác vụ ngầm kiểm tra mỗi 5 phút một lần để xử lý
                các bản ghi đang chờ duyệt quá thời gian thiết lập.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs list filter */}
      <Tabs
        activeKey={activeSubTab}
        onChange={(key) => setActiveSubTab(key as StatusTab)}
        className="custom-tabs border-b border-gray-200 dark:border-gray-800"
        items={[
          {
            key: "PENDING",
            label: (
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Chờ duyệt
              </span>
            ),
          },
          {
            key: "APPROVED",
            label: (
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
                Đã duyệt
              </span>
            ),
          },
          {
            key: "REJECTED",
            label: (
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <XCircle className="h-4 w-4" aria-hidden="true" />
                Đã từ chối
              </span>
            ),
          },
          {
            key: "EXPIRED",
            label: (
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Đã hết hạn
              </span>
            ),
          },
        ]}
      />

      {/* Main Content List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-[#E0E0E0] bg-white dark:border-gray-800 dark:bg-gray-900">
          <Spin size="large" description="Đang tải dữ liệu bài đăng…" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E0E0E0] bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
          <MessageSquare
            className="h-12 w-12 text-gray-300 dark:text-gray-700"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-[15px] font-semibold text-gray-900 dark:text-white">
            Không có bài viết nào
          </h3>
          <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
            Mục này hiện đang trống sạch sẽ.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative overflow-hidden rounded-xl border border-[#E0E0E0] bg-white p-5 transition-all hover:border-[#2F9E44]/40 dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="relative">
                    <img
                      src={
                        post.author?.avatarUrl && post.author.avatarUrl !== ""
                          ? post.author.avatarUrl
                          : "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
                      }
                      alt={post.author?.name}
                      className="h-11 w-11 rounded-full border border-gray-100 object-cover dark:border-gray-800"
                    />
                    <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-extrabold text-white ring-2 ring-white">
                      🌾
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[15px] font-semibold text-gray-900 transition-colors group-hover:text-[#2F9E44] dark:text-white">
                        {post.author?.name}
                      </h4>
                      {post.isAdminPost && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                          <Shield className="h-3 w-3" aria-hidden="true" /> BQT
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2.5 text-[12px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {new Date(post.createdAt).toLocaleString("vi-VN")}
                      </span>
                      <span>•</span>
                      {post.category && (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <Tag className="h-3 w-3" aria-hidden="true" />
                          {post.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Use the new reusable PostStatusBadge */}
                <PostStatusBadge
                  status={post.status}
                  rejectedBy={post.rejectedBy}
                />
              </div>

              {/* Content body */}
              <div className="mt-4 text-[14px] leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {activeSubTab === "PENDING" || activeSubTab === "REJECTED"
                  ? highlightBannedWords(post.content)
                  : post.content}
              </div>

              {/* Render attached images if any */}
              {post.images && post.images.length > 0 && (
                <Image.PreviewGroup>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {post.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800"
                      >
                        <Image
                          src={imgUrl || undefined}
                          alt={`Attachment-${idx}`}
                          className="object-cover"
                          style={{ width: "100%", height: "100%" }}
                          preview={{ mask: "Xem" }}
                        />
                      </div>
                    ))}
                  </div>
                </Image.PreviewGroup>
              )}

              {/* Flagged reasons */}
              {post.flaggedReason && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-100/50 bg-rose-50/70 p-3.5 text-[13px] text-rose-900 dark:border-rose-950/30 dark:bg-rose-950/10 dark:text-rose-400">
                  <AlertTriangle
                    className="h-4 w-4 shrink-0 text-rose-500"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-semibold">Lý do từ chối:</span>{" "}
                    {post.flaggedReason}
                  </div>
                </div>
              )}

              {/* Controls */}
              {activeSubTab === "PENDING" && (
                <div className="dark:border-gray-850 mt-5 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                  <Button
                    danger
                    icon={<XCircle className="h-4 w-4" aria-hidden="true" />}
                    onClick={() => handleRejectClick(post.id)}
                    className="flex items-center gap-1.5 rounded-lg border-rose-200 bg-white font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Từ chối bài viết
                  </Button>
                  <Button
                    type="primary"
                    icon={
                      <CheckCircle className="h-4 w-4" aria-hidden="true" />
                    }
                    onClick={() => handleApprove(post.id)}
                    className="flex items-center gap-1.5 rounded-lg border-none bg-[#2F9E44] font-semibold shadow-xs hover:bg-[#208234]"
                  >
                    Phê duyệt đăng bài
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Load more */}
          {hasNextPage && (
            <div className="mt-6 flex justify-center pb-4">
              <Button
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
                className="flex items-center gap-1.5 rounded-xl border border-gray-300 px-6 py-2 text-[14px] font-semibold text-gray-700 hover:border-[#2F9E44] hover:text-[#2F9E44]"
              >
                <span>Xem thêm bài viết</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-rose-600">
            <XCircle className="h-5 w-5" aria-hidden="true" />
            <span className="text-[16px] font-bold">
              Nhập lý do từ chối đăng bài
            </span>
          </div>
        }
        open={isRejectModalOpen}
        onOk={handleRejectSubmit}
        onCancel={() => setIsRejectModalOpen(false)}
        okText="Từ chối ngay"
        okButtonProps={{ danger: true, style: { fontWeight: 600 } }}
        cancelText="Quay lại"
        cancelButtonProps={{ style: { fontWeight: 600 } }}
        destroyOnHidden
      >
        <div className="space-y-3 py-4">
          <p className="text-[13px] text-gray-500 dark:text-gray-400">
            Lý do này sẽ được hiển thị công khai tới người dùng gửi đăng bài,
            giúp họ sửa đổi và hiểu rõ quy tắc của hệ thống.
          </p>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Ví dụ: Chứa các từ quảng cáo thuốc giả chưa kiểm chứng hoặc thô tục…"
            aria-label="Lý do từ chối bài viết"
            className="rounded-lg border border-gray-300 p-2.5 text-[14px] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44]"
          />
        </div>
      </Modal>
    </div>
  );
}
