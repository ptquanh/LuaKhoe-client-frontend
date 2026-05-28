"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";
import { message } from "antd";

import { userService } from "@/services/user.service";

interface AvatarUploadProps {
  avatarUrl: string;
  username: string;
}

export function AvatarUpload({ avatarUrl, username }: AvatarUploadProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const res = await userService.uploadAvatar(file);
      if (!res.success) {
        throw new Error(res.message || "Tải lên ảnh đại diện thất bại.");
      }
      return res.data;
    },
    onSuccess: (data) => {
      message.success("Cập nhật ảnh đại diện thành công!");
      // Invalidate all related profile & forum queries for absolute instant UI sync
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      queryClient.invalidateQueries({ queryKey: ["forum-comments"] });
    },
    onError: (err: any) => {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Tải lên ảnh thất bại. Vui lòng thử lại.";
      message.error(errMsg);
    },
  });

  const handleContainerClick = () => {
    if (uploadMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side quick type validation (only JPG, JPEG, PNG, WEBP allowed)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      message.error("Chỉ chấp nhận tệp hình ảnh (JPG, JPEG, PNG, WEBP)!");
      return;
    }

    // Client-side quick size validation (10MB limit)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      message.error("Kích thước tệp hình ảnh không được vượt quá 10MB!");
      return;
    }

    uploadMutation.mutate(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Interactive Avatar Frame */}
      <div
        onClick={handleContainerClick}
        className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-green-500 bg-gray-50 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-green-600 dark:bg-gray-800"
      >
        {/* Actual Image */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username || "Avatar"}
            width={96}
            height={96}
            priority
            className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-green-50 text-green-600 dark:bg-gray-800 dark:text-green-400">
            <span className="text-2xl font-bold uppercase">
              {username?.charAt(0) || "U"}
            </span>
          </div>
        )}

        {/* Hover Camera Overlay & Loading Spinner */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black/50">
          {uploadMutation.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin text-green-400" />
          ) : (
            <>
              <Camera className="mb-0.5 h-5 w-5" />
              <span className="text-[10px] font-semibold tracking-wide uppercase">
                Thay đổi
              </span>
            </>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        disabled={uploadMutation.isPending}
        className="hidden"
      />
    </div>
  );
}
