export const formatConfidenceToPercent = (
  value: number | undefined | null,
): string => {
  if (value == null || isNaN(value)) return "0%";

  // Nếu giá trị từ 0 đến 1 (Bao gồm cả 1), nhân 100.
  // Nếu giá trị > 1 (Trường hợp DB đã lưu sẵn số to như 90, 100), giữ nguyên.
  const percent = value <= 1 ? value * 100 : value;

  // Làm tròn đến tối đa 1 chữ số thập phân (VD: 98.5%) hoặc làm tròn chẵn
  return `${Number(percent.toFixed(1))}%`;
};
