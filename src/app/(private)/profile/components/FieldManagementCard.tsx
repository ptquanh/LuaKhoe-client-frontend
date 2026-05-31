"use client";

import { Alert, Card, Input, message, Modal, Switch } from "antd";
import {
  Check,
  Compass,
  Edit2,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { lazy, Suspense, useCallback, useState } from "react";

import { useUserFields } from "@/hooks/useUserFields";
import { UserField } from "@/types/auth.type";

const LazyMapComponent = lazy(
  () => import("../../diagnose/components/MapComponent"),
);

export function FieldManagementCard() {
  const {
    fields,
    isLoading,
    createField,
    updateField,
    deleteField,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    setError,
  } = useUserFields();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<UserField | null>(null);

  // Modal Form State
  const [fieldName, setFieldName] = useState("");
  const [address, setAddress] = useState("");
  const [gpsLat, setGpsLat] = useState<number | undefined>(undefined);
  const [gpsLng, setGpsLng] = useState<number | undefined>(undefined);
  const [isDefault, setIsDefault] = useState(false);

  // Address Search State
  const [addressQuery, setAddressQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Open modal for creating a new field
  const handleOpenAddModal = () => {
    setEditingField(null);
    setFieldName("");
    setAddress("");
    setGpsLat(10.3759); // Default to Mekong Delta coordinates
    setGpsLng(105.4246);
    setIsDefault(fields.length === 0); // Default to true if it's the first field
    setAddressQuery("");
    setError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing a field
  const handleOpenEditModal = (field: UserField) => {
    setEditingField(field);
    setFieldName(field.fieldName);
    setAddress(field.address || "");
    setGpsLat(Number(field.gpsLat));
    setGpsLng(Number(field.gpsLng));
    setIsDefault(field.isDefault);
    setAddressQuery("");
    setError(null);
    setIsModalOpen(true);
  };

  // Handle address Nominatim search
  const handleSearchAddress = useCallback(async () => {
    if (!addressQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&countrycodes=vn&limit=1&accept-language=vi`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setGpsLat(lat);
        setGpsLng(lng);
        setAddress(data[0].display_name);
        message.success("Tìm thấy địa chỉ ruộng thành công!");
      } else {
        message.warning(
          "Không tìm thấy địa chỉ này. Vui lòng ghim thủ công trên bản đồ.",
        );
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tìm kiếm địa chỉ ruộng.");
    } finally {
      setIsSearching(false);
    }
  }, [addressQuery]);

  // Handle GPS location query
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      message.error("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude);
        setGpsLng(pos.coords.longitude);
        setIsGettingLocation(false);
        message.success("Đã lấy vị trí GPS hiện tại!");
      },
      (err) => {
        console.error(err);
        message.warning(
          "Không thể lấy vị trí. Vui lòng ghim trực tiếp trên bản đồ.",
        );
        setIsGettingLocation(false);
      },
    );
  };

  // Save/Create Field Location Handler
  const handleSaveField = async () => {
    if (!fieldName.trim()) {
      setError("Vui lòng nhập tên gợi nhớ cho ruộng.");
      return;
    }
    if (gpsLat === undefined || gpsLng === undefined) {
      setError("Vui lòng chọn vị trí ruộng trên bản đồ.");
      return;
    }

    const payload = {
      fieldName: fieldName.trim(),
      address: address.trim() || undefined,
      gpsLat,
      gpsLng,
      isDefault,
    };

    if (editingField) {
      await updateField(editingField.id, payload, () => {
        message.success("Cập nhật thông tin ruộng thành công!");
        setIsModalOpen(false);
      });
    } else {
      await createField(payload, () => {
        message.success("Thêm ruộng đất mới thành công!");
        setIsModalOpen(false);
      });
    }
  };

  // Set selected field as default instantly
  const handleSetDefault = async (field: UserField) => {
    if (field.isDefault) return;
    await updateField(field.id, { isDefault: true }, () => {
      message.success(`Đã thiết lập "${field.fieldName}" làm ruộng mặc định.`);
    });
  };

  // Delete field with confirmation fallback
  const handleDeleteField = (field: UserField) => {
    Modal.confirm({
      title: "Xóa ruộng đất",
      content: `Bạn có chắc chắn muốn xóa "${field.fieldName}"?${
        field.isDefault
          ? " Ruộng này đang là mặc định, một ruộng khác sẽ tự động được chọn làm mặc định."
          : ""
      }`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        await deleteField(field.id, () => {
          message.success("Đã xóa ruộng thành công.");
        });
      },
    });
  };

  const isSaving = isCreating || isUpdating;

  return (
    <Card
      className="rounded-2xl border-gray-100 font-[Inter,sans-serif] shadow-sm transition-all duration-200 hover:shadow-md"
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-800">
            Quản lý vị trí ruộng đất
          </span>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-[#22c55e] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:scale-[1.02] hover:bg-green-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm ruộng mới
          </button>
        </div>
      }
    >
      <div className="mb-6">
        <p className="text-[13.5px] leading-relaxed text-gray-500">
          Đăng ký các ruộng canh tác của bạn để nhận thông tin thời tiết chính
          xác từng khu vực, hỗ trợ tối đa cho việc khoanh vùng dịch tễ và chẩn
          đoán bệnh lúa.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-36 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#22c55e]" />
        </div>
      ) : fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center text-gray-400">
          <MapPin className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="text-sm font-medium">Bạn chưa lưu vị trí ruộng nào</p>
          <p className="mt-1 text-xs text-gray-400">
            Hãy thêm mảnh ruộng đầu tiên để bắt đầu lưu dữ liệu chẩn đoán nhanh.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 ${
                field.isDefault
                  ? "border-[#22c55e] bg-[#f0fdf4]/40 shadow-xs"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="line-clamp-1 text-[14.5px] font-bold text-gray-800">
                    {field.fieldName}
                  </h4>
                  {field.isDefault && (
                    <span className="flex items-center gap-1 rounded-full bg-[#22c55e] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                      Mặc định
                    </span>
                  )}
                </div>

                <div className="mt-2.5 space-y-1.5 text-[12.5px] text-gray-500">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22c55e]" />
                    <span className="line-clamp-2">
                      {field.address || "Chưa xác định địa chỉ"}
                    </span>
                  </div>
                  <div className="pl-5 font-mono text-[11px] text-gray-400">
                    Tọa độ: {Number(field.gpsLat).toFixed(5)},{" "}
                    {Number(field.gpsLng).toFixed(5)}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(field)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-100 text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteField(field)}
                    disabled={isDeleting}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red-50 text-red-500 transition-all hover:bg-red-50/50"
                    title="Xóa"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {!field.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(field)}
                    className="cursor-pointer text-[12px] font-semibold text-[#22c55e] transition-all hover:text-green-600"
                  >
                    Đặt mặc định
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unified Add/Edit Modal */}
      <Modal
        title={
          <span className="text-base font-bold text-gray-800">
            {editingField ? "Chỉnh sửa vị trí ruộng" : "Thêm vị trí ruộng mới"}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={650}
        destroyOnHidden
        className="font-[Inter,sans-serif]"
      >
        <div className="mt-4 space-y-4">
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              className="rounded-xl font-medium"
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Tên gợi nhớ của ruộng <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ví dụ: Ruộng Thượng Điền 1"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                className="h-10 rounded-xl border-gray-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Địa chỉ chữ (Tùy chọn)
              </label>
              <Input
                placeholder="Tự động điền hoặc tự nhập..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-10 rounded-xl border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#22c55e] bg-white text-[12.5px] font-semibold text-[#22c55e] transition-all hover:bg-green-50/50 disabled:opacity-50"
              >
                {isGettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Compass className="h-4 w-4" />
                )}
                Định vị vị trí hiện tại
              </button>
            </div>

            <div className="relative">
              <Input
                placeholder="Tìm địa chỉ ruộng nhanh để ghim..."
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchAddress();
                  }
                }}
                className="h-10 rounded-xl border-gray-200 pr-12"
              />
              <button
                type="button"
                onClick={handleSearchAddress}
                disabled={isSearching}
                className="absolute top-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-[#22c55e] text-white hover:bg-green-600 disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Leaflet interactive Map */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <div className="h-[280px] w-full">
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#22c55e]" />
                  </div>
                }
              >
                <LazyMapComponent
                  gpsLat={gpsLat}
                  gpsLng={gpsLng}
                  setGpsLat={setGpsLat}
                  setGpsLng={setGpsLng}
                />
              </Suspense>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-50 py-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-gray-700">
                Ruộng mặc định
              </span>
              <span className="text-[11px] text-gray-400">
                Luôn tự động chọn ruộng này lúc chẩn đoán bệnh
              </span>
            </div>
            <Switch
              checked={isDefault}
              disabled={
                fields.length === 0 ||
                (editingField?.isDefault && fields.length > 1)
              } // Don't allow toggling off if it's the only default field
              onChange={(checked) => setIsDefault(checked)}
              className={isDefault ? "bg-[#22c55e]" : ""}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-50 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveField}
              disabled={isSaving}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#22c55e] px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-600 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingField ? "Lưu thay đổi" : "Lưu ruộng mới"}
            </button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
