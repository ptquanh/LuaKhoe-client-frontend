export interface DiagnoseResponse {
  disease_name: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  recommendations: string[];
  is_valid_image: boolean;
  error_message?: string;
}

export interface DiagnosePayload {
  image: File;
}

// Mock response dùng khi FastAPI chưa sẵn sàng
export const MOCK_DIAGNOSE_RESPONSE: DiagnoseResponse = {
  disease_name: "Đạo ôn lá",
  confidence: 0.921,
  severity: "high",
  description:
    "Bệnh đạo ôn do nấm Magnaporthe oryzae gây ra, xuất hiện dưới dạng các vết bệnh hình thoi màu nâu xám trên lá lúa.",
  recommendations: [
    "Phun thuốc Beam 75WP với liều lượng 0.3 kg/ha",
    "Rút nước để ruộng khô ráo",
    "Ngừng bón đạm ngay lập tức",
    "Theo dõi ruộng lúa 3-5 ngày sau khi phun",
  ],
  is_valid_image: true,
};
