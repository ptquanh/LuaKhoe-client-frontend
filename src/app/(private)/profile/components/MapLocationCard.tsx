import React from "react";
import { Card, Form, Input, Button, Row, Col } from "antd";
import { MapPin, Save } from "lucide-react";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      <p className="mt-3 text-sm font-medium text-gray-400">
        Đang tải bản đồ...
      </p>
    </div>
  ),
});

interface MapLocationCardProps {
  mapPosition: [number, number];
  handleMapLocationSelect: (lat: number, lng: number) => void;
  handleGetCurrentGps: () => void;
  isGpsLoading: boolean;
  isUpdating: boolean;
  setMapLat: (val: string) => void;
  setMapLng: (val: string) => void;
}

export function MapLocationCard({
  mapPosition,
  handleMapLocationSelect,
  handleGetCurrentGps,
  isGpsLoading,
  isUpdating,
  setMapLat,
  setMapLng,
}: MapLocationCardProps) {
  return (
    <Card
      className="rounded-2xl border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
      title={
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <span className="text-lg font-bold text-gray-800">
            Vị trí ruộng (GPS)
          </span>
        </div>
      }
      extra={
        <Button
          type="dashed"
          onClick={handleGetCurrentGps}
          loading={isGpsLoading}
          className="flex items-center justify-center rounded-lg text-xs font-medium hover:!border-green-600 hover:!text-green-600 sm:text-sm"
        >
          Lấy vị trí tự động
        </Button>
      }
    >
      <div className="mb-5">
        <p className="text-sm leading-relaxed text-gray-500">
          Vui lòng kéo thả Marker màu xanh hoặc click vào vị trí bất kì trên bản
          đồ dưới đây để chọn tọa độ mảnh ruộng của bạn. Hệ thống sẽ tự động
          đồng bộ.
        </p>
      </div>

      <div className="mb-6 h-[320px] w-full overflow-hidden rounded-2xl border border-gray-100 shadow-inner">
        <LocationMap
          position={mapPosition}
          onLocationSelect={handleMapLocationSelect}
        />
      </div>

      <Row gutter={16}>
        <Col xs={12}>
          <Form.Item
            label={
              <span className="font-medium text-gray-600">
                Vĩ độ (Latitude)
              </span>
            }
            name="latitude"
          >
            <Input
              placeholder="Ví dụ: 10.7626"
              className="rounded-lg"
              onChange={(e) => setMapLat(e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item
            label={
              <span className="font-medium text-gray-600">
                Kinh độ (Longitude)
              </span>
            }
            name="longitude"
          >
            <Input
              placeholder="Ví dụ: 106.6602"
              className="rounded-lg"
              onChange={(e) => setMapLng(e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="mt-2 flex justify-start">
        <Button
          type="primary"
          htmlType="submit"
          loading={isUpdating}
          icon={<Save className="h-4 w-4" />}
          style={{
            backgroundColor: "#22c55e",
            borderColor: "#22c55e",
          }}
          className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-sm hover:!border-green-600 hover:!bg-green-600"
        >
          Lưu thay đổi hồ sơ & vị trí
        </Button>
      </div>
    </Card>
  );
}
