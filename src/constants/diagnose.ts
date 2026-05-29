/**
 * Standardized field parameter values (Vietnamese)
 * Must stay in sync with the AI backend (src/modules/predict/constants.py)
 */

export const WATER_OPTIONS = ["Bình thường", "Ngập úng", "Khô hạn"] as const;
export const GROWTH_OPTIONS = [
  "Mạ",
  "Đẻ nhánh",
  "Làm đòng",
  "Trỗ bông",
  "Chín",
] as const;
export const DENSITY_OPTIONS = ["Vừa", "Dày", "Thưa"] as const;

export const FIELD_PARAM_DEFAULTS = {
  water: "",
  growth: "",
  density: "",
  fog: null,
  pesticide: null,
};
