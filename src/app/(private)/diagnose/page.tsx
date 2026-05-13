"use client";

import { useState, useRef, Suspense } from "react";
import { Upload, Camera, X, Loader2, Info, Sun, Maximize, Droplets, Leaf, CheckCircle, XCircle, MapPin, Mic, MicOff, Map as MapIcon, ChevronRight, Search } from "lucide-react";
import { useDiagnose } from "@/hooks/useDiagnose";
import { ImageWithFallback } from "@/components/ImageWithFallback";

const goodExamples = [
  { url: "https://images.unsplash.com/photo-1658315216731-d0548fd66f25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JlZW4lMjByaWNlJTIwbGVhZiUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc0NDQ1MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080", label: "Rõ nét, đủ sáng" },
  { url: "https://images.unsplash.com/photo-1600420636132-5ccf1ffd711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwbGVhZiUyMGRpc2Vhc2UlMjBicm93biUyMHNwb3QlMjBjbG9zZXxlbnwxfHx8fDE3NzQ0NDUzMjh8MA&ixlib=rb-4.1.0&q=80&w=1080", label: "Thấy rõ vết bệnh" },
];

const badExamples = [
  { url: "https://images.unsplash.com/photo-1770622477798-136376ccbe4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVycnklMjBwbGFudCUyMGxlYWYlMjBvdXQlMjBvZiUyMGZvY3VzfGVufDF8fHx8MTc3NDQ0NTMyOXww&ixlib=rb-4.1.0&q=80&w=1080", label: "Bị mờ, không rõ" },
  { url: "https://images.unsplash.com/photo-1595934542389-3a76137b756e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwdW5kZXJleHBvc2VkJTIwcGxhbnQlMjBsZWFmfGVufDF8fHx8MTc3NDQ0NTMyOXww&ixlib=rb-4.1.0&q=80&w=1080", label: "Quá tối, thiếu sáng" },
];

const suggestedTags = ["Lá vàng", "Có đốm", "Thân héo", "Mới gieo sạ", "Lá khô", "Cháy lá", "Rễ thối", "Bông bị cháy"];

export default function DiagnosePage() {
  const { predict, isLoading, result, error, reset } = useDiagnose();
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<{ raw: File; url: string } | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  
  const [locationMode, setLocationMode] = useState<"default" | "gps" | "map">("default");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile({ raw: f, url: URL.createObjectURL(f) });
      reset();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile({ raw: f, url: URL.createObjectURL(f) });
      reset();
    }
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  const handlePredict = () => {
    if (file) {
      predict(file.raw);
    }
  };

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const isHealthy = result?.disease_key === "Healthy";
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical": return { color: "text-[#E53935]", bg: "bg-[#FFEBEE]", border: "border-[#FFCDD2]", label: "Cấp bách" };
      case "high": return { color: "text-[#FB8C00]", bg: "bg-[#FFF3E0]", border: "border-[#FFE0B2]", label: "Nghiêm trọng" };
      case "medium": return { color: "text-[#FBC02D]", bg: "bg-[#FFFDE7]", border: "border-[#FFF9C4]", label: "Trung bình" };
      case "low": return { color: "text-[#2F9E44]", bg: "bg-[#E6F4EA]", border: "border-[#A5D6A7]", label: "Nhẹ" };
      default: return { color: "text-[#1976D2]", bg: "bg-[#E3F2FD]", border: "border-[#BBDEFB]", label: "Bình thường" };
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-[28px] font-[700] text-[#1B1B1B]">Chẩn đoán bệnh lúa</h1>
        <p className="text-[14px] text-[#5C5C5C] mt-1">Tải lên ảnh lá lúa để AI phân tích và chẩn đoán bệnh</p>
      </div>

      {!file && (
        <div className="bg-[#E6F4EA] border border-[#2F9E44]/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-[#2F9E44]" />
              <h4 className="text-[14px] font-[600] text-[#1F6F2E]">Hướng dẫn chụp ảnh lá lúa rõ nét</h4>
            </div>
            <button onClick={() => setShowExamples(!showExamples)} className="text-[12px] text-[#2F9E44] hover:text-[#1F6F2E] font-[500] cursor-pointer underline">
              {showExamples ? "Ẩn ảnh mẫu" : "Xem ảnh mẫu"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-start gap-2"><Sun className="w-4 h-4 text-[#2F9E44] mt-0.5 shrink-0" /><p className="text-[12px] text-[#1B1B1B]">Chụp ngoài trời, đủ ánh sáng tự nhiên</p></div>
            <div className="flex items-start gap-2"><Maximize className="w-4 h-4 text-[#2F9E44] mt-0.5 shrink-0" /><p className="text-[12px] text-[#1B1B1B]">Chụp gần, rõ vết bệnh trên lá (15-30cm)</p></div>
            <div className="flex items-start gap-2"><Droplets className="w-4 h-4 text-[#2F9E44] mt-0.5 shrink-0" /><p className="text-[12px] text-[#1B1B1B]">Tránh chụp khi lá ướt sương hoặc mưa</p></div>
            <div className="flex items-start gap-2"><Leaf className="w-4 h-4 text-[#2F9E44] mt-0.5 shrink-0" /><p className="text-[12px] text-[#1B1B1B]">Đặt lá trên nền phẳng nếu có thể</p></div>
          </div>
        </div>
      )}

      {showExamples && !file && (
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3"><CheckCircle className="w-5 h-5 text-[#2F9E44]" /><h5 className="text-[14px] font-[600] text-[#2F9E44]">Ảnh tốt — AI phân tích chính xác</h5></div>
              <div className="grid grid-cols-2 gap-2">
                {goodExamples.map((ex, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border-2 border-[#2F9E44]/30">
                    <ImageWithFallback src={ex.url} alt={ex.label} className="w-full h-[120px] object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-2"><p className="text-[11px] text-white">{ex.label}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3"><XCircle className="w-5 h-5 text-[#E53935]" /><h5 className="text-[14px] font-[600] text-[#E53935]">Ảnh xấu — Kết quả không chính xác</h5></div>
              <div className="grid grid-cols-2 gap-2">
                {badExamples.map((ex, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border-2 border-[#E53935]/30">
                    <ImageWithFallback src={ex.url} alt={ex.label} className="w-full h-[120px] object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-2"><p className="text-[11px] text-white">{ex.label}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[#FFF8E1] border border-[#FB8C00] flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#FB8C00] shrink-0 mt-0.5" />
          <p className="text-[14px] font-[500] text-[#F57C00]">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer min-h-[320px] flex flex-col items-center justify-center ${isDragging ? "border-[#2F9E44] bg-[#E6F4EA]" : "border-[#E0E0E0] bg-white hover:border-[#2F9E44] hover:bg-[#E6F4EA]/30"}`}
            >
              <input id="file-input" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Upload className="w-7 h-7 text-[#2F9E44]" /></div>
              <h3 className="text-[18px] font-[600] text-[#1B1B1B] mb-2">Kéo thả hoặc chọn file</h3>
              <p className="text-[14px] text-[#5C5C5C] mb-6">Hỗ trợ JPG, PNG, WEBP. Tối đa 10MB</p>
              <button className="h-10 px-4 rounded-lg bg-[#2F9E44] text-white text-[14px] hover:bg-[#1F6F2E] flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" /> Chọn ảnh</button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
              {/* Image Comparison: Original vs Annotated */}
              {result?.annotated_image ? (
                <div className="relative flex flex-col">
                  <button onClick={handleReset} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer transition-colors z-20"><X className="w-4 h-4" /></button>
                  <div className="grid grid-cols-2 gap-0 border-b border-[#E0E0E0]">
                    {/* Original Image */}
                    <div className="relative border-r border-[#E0E0E0]">
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                        <span className="text-[11px] font-[600] text-white tracking-wide uppercase">Ảnh gốc</span>
                      </div>
                      <div className="aspect-square w-full bg-black/5 flex items-center justify-center p-2">
                        <img src={file.url} alt="Original" className="max-h-full max-w-full object-contain rounded-lg" />
                      </div>
                    </div>
                    {/* Annotated Image with Mask */}
                    <div className="relative">
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#E53935]/90 backdrop-blur-sm">
                        <span className="text-[11px] font-[600] text-white tracking-wide uppercase">AI phát hiện</span>
                      </div>
                      <div className="aspect-square w-full bg-black/5 flex items-center justify-center p-2">
                        <img src={`data:image/png;base64,${result.annotated_image}`} alt="AI Detection" className="max-h-full max-w-full object-contain rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video w-full bg-black/5 flex items-center justify-center p-2">
                  <img src={file.url} alt="Preview" className="max-h-[300px] object-contain rounded-lg shadow-sm" />
                  <button onClick={handleReset} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer transition-colors"><X className="w-4 h-4" /></button>
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <Loader2 className="w-8 h-8 text-[#2F9E44] animate-spin mb-3" />
                      <p className="text-[14px] font-[500] text-[#2F9E44]">AI đang phân tích hình ảnh...</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-4 border-t border-[#E0E0E0] bg-[#FAFAFA]">
                <label className="text-[13px] font-[500] text-[#1B1B1B] mb-2 block">Mô tả triệu chứng (Tùy chọn)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestedTags.map((tag) => (
                    <button key={tag} onClick={() => toggleTag(tag)} className={`h-7 px-2.5 rounded-full text-[12px] font-[500] cursor-pointer transition-colors ${selectedTags.includes(tag) ? "bg-[#2F9E44] text-white" : "bg-white border border-[#E0E0E0] text-[#5C5C5C] hover:bg-[#F0F2F5]"}`}>
                      {tag}
                    </button>
                  ))}
                </div>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Nhập chi tiết..." rows={2} className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-[13px] resize-none focus:outline-none focus:border-[#2F9E44] mb-4" />
                
                <div className="flex gap-3">
                  <button onClick={handleReset} disabled={isLoading} className="flex-1 h-11 rounded-lg border border-[#E0E0E0] text-[15px] font-[500] text-[#5C5C5C] hover:bg-[#F0F2F5] transition-colors cursor-pointer disabled:opacity-50">Hủy</button>
                  {!result && <button onClick={handlePredict} disabled={isLoading} className="flex-1 h-11 rounded-lg bg-[#2F9E44] text-white text-[15px] font-[500] hover:bg-[#1F6F2E] transition-colors cursor-pointer disabled:opacity-50">Phân tích</button>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-xl border border-[#E0E0E0] h-full flex flex-col">
            <div className="p-5 border-b border-[#E0E0E0]"><h3 className="text-[18px] font-[600] text-[#1B1B1B]">Kết quả chẩn đoán</h3></div>
            <div className="p-5 flex-1 flex flex-col">
              {!result ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F0F2F5] flex items-center justify-center mb-4"><Search className="w-8 h-8 text-[#9E9E9E]" /></div>
                  <p className="text-[14px] text-[#5C5C5C] max-w-[200px]">Kết quả sẽ hiển thị tại đây sau khi bạn tải ảnh lên</p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {isHealthy ? (
                    <div className={`p-4 rounded-xl border mb-6 bg-[#E6F4EA] border-[#2F9E44]/30`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-[600] text-[#5C5C5C] uppercase tracking-wider">Tình trạng</span>
                        <div className="px-2 py-0.5 rounded text-[12px] font-[600] bg-[#E6F4EA] text-[#2F9E44] border border-[#A5D6A7]">✅ Khỏe mạnh</div>
                      </div>
                      <h2 className={`text-[24px] font-[700] mb-3 text-[#1F6F2E]`}>{result.disease_name}</h2>
                      <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
                        <span className="text-[13px] font-[500] text-[#5C5C5C]">Độ chính xác:</span>
                        <div className="flex-1 h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                          <div className={`h-full bg-[#2F9E44]`} style={{ width: `${Math.round(result.confidence * 100)}%` }} />
                        </div>
                        <span className="text-[14px] font-[700] text-[#1B1B1B]">{Math.round(result.confidence * 100)}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {(result.detections && result.detections.length > 0 ? result.detections : [{disease: result.disease_name, confidence: result.confidence}]).map((det, i) => (
                        <div key={i} className="p-4 rounded-xl border bg-white border-[#E0E0E0] shadow-sm hover:border-[#FB8C00]/30 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-[600] text-[#9E9E9E] uppercase tracking-wider">Phát hiện #{i + 1}</span>
                            <div className="flex items-center gap-1.5 text-[12px] font-[600] text-[#FB8C00]">
                              <Info className="w-3.5 h-3.5" /> AI Phân tích
                            </div>
                          </div>
                          <h2 className="text-[20px] font-[700] mb-3 text-[#E65100]">{det.disease}</h2>
                          <div className="flex items-center gap-3 bg-[#FAFAFA] p-2.5 rounded-lg border border-[#F0F2F5]">
                            <span className="text-[12px] font-[500] text-[#5C5C5C]">Độ tin cậy:</span>
                            <div className="flex-1 h-1.5 bg-[#E0E0E0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#FB8C00]" style={{ width: `${Math.round(det.confidence * 100)}%` }} />
                            </div>
                            <span className="text-[13px] font-[700] text-[#1B1B1B]">{Math.round(det.confidence * 100)}%</span>
                          </div>
                        </div>
                      ))}
                      
                      {/* Overall Severity Assessment */}
                      <div className={`p-3 rounded-lg border ${getSeverityStyle(result.severity).bg} ${getSeverityStyle(result.severity).border} flex items-center justify-between shadow-sm`}>
                        <div className="flex items-center gap-2">
                          <Maximize className="w-4 h-4 text-[#5C5C5C]" />
                          <span className="text-[13px] font-[600] text-[#5C5C5C]">Đánh giá mức độ tổng thể:</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[13px] font-[800] ${getSeverityStyle(result.severity).color}`}>
                          {getSeverityStyle(result.severity).label.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  {!isHealthy && (
                    <div className="space-y-5">
                      {result.rag_recommendation ? (
                        <div className="space-y-4">
                          {/* Immediate Actions */}
                          {result.rag_recommendation.immediate_actions && result.rag_recommendation.immediate_actions.length > 0 && (
                            <div>
                              <h4 className="text-[15px] font-[600] text-[#1B1B1B] mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#2F9E44]" /> Hành động khẩn cấp</h4>
                              <ul className="space-y-2 bg-[#FAFAFA] p-3 rounded-lg border border-[#E0E0E0]">
                                {result.rag_recommendation.immediate_actions.map((item, i) => (
                                  <li key={i} className="flex gap-2 text-[14px] text-[#5C5C5C] leading-[1.5]"><span className="text-[#E53935] mt-0.5">•</span> <span>{item}</span></li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Treatment Protocol */}
                          {result.rag_recommendation.treatment_protocol && (
                            <div>
                              <h4 className="text-[15px] font-[600] text-[#1B1B1B] mb-2 flex items-center gap-2"><Droplets className="w-4 h-4 text-[#2F9E44]" /> Phác đồ điều trị</h4>
                              <div className="bg-[#FAFAFA] p-3 rounded-lg border border-[#E0E0E0] space-y-3">
                                {result.rag_recommendation.treatment_protocol.chemical && result.rag_recommendation.treatment_protocol.chemical !== "Không có dữ liệu trong tài liệu tham khảo" && (
                                  <div>
                                    <strong className="text-[13px] text-[#1B1B1B]">Hóa học:</strong>
                                    <p className="text-[14px] text-[#5C5C5C] leading-[1.5] mt-1">{result.rag_recommendation.treatment_protocol.chemical}</p>
                                  </div>
                                )}
                                {result.rag_recommendation.treatment_protocol.biological && result.rag_recommendation.treatment_protocol.biological !== "Không có dữ liệu trong tài liệu tham khảo" && (
                                  <div>
                                    <strong className="text-[13px] text-[#1B1B1B]">Sinh học:</strong>
                                    <p className="text-[14px] text-[#5C5C5C] leading-[1.5] mt-1">{result.rag_recommendation.treatment_protocol.biological}</p>
                                  </div>
                                )}
                                {result.rag_recommendation.treatment_protocol.cultural && result.rag_recommendation.treatment_protocol.cultural !== "Không có dữ liệu trong tài liệu tham khảo" && (
                                  <div>
                                    <strong className="text-[13px] text-[#1B1B1B]">Canh tác:</strong>
                                    <p className="text-[14px] text-[#5C5C5C] leading-[1.5] mt-1">{result.rag_recommendation.treatment_protocol.cultural}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* NPK Adjustment */}
                          {result.rag_recommendation.npk_adjustment && result.rag_recommendation.npk_adjustment !== "Không có dữ liệu trong tài liệu tham khảo" && (
                            <div>
                              <h4 className="text-[15px] font-[600] text-[#1B1B1B] mb-2 flex items-center gap-2"><Leaf className="w-4 h-4 text-[#2F9E44]" /> Điều chỉnh dinh dưỡng (NPK)</h4>
                              <p className="text-[14px] text-[#5C5C5C] leading-[1.6] bg-[#FAFAFA] p-3 rounded-lg border border-[#E0E0E0]">{result.rag_recommendation.npk_adjustment}</p>
                            </div>
                          )}

                          {/* Prevention Measures */}
                          {result.rag_recommendation.prevention_measures && result.rag_recommendation.prevention_measures.length > 0 && (
                            <div>
                              <h4 className="text-[15px] font-[600] text-[#1B1B1B] mb-2 flex items-center gap-2"><Sun className="w-4 h-4 text-[#2F9E44]" /> Biện pháp phòng ngừa</h4>
                              <ul className="space-y-2 bg-[#FAFAFA] p-3 rounded-lg border border-[#E0E0E0]">
                                {result.rag_recommendation.prevention_measures.map((item, i) => (
                                  <li key={i} className="flex gap-2 text-[14px] text-[#5C5C5C] leading-[1.5]"><span className="text-[#2F9E44] mt-0.5">•</span> <span>{item}</span></li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6 bg-[#FAFAFA] rounded-xl border border-[#E0E0E0]">
                          <Info className="w-8 h-8 text-[#9E9E9E] mb-2" />
                          <p className="text-[14px] text-[#5C5C5C]">Không có hướng dẫn chi tiết cho bệnh này hoặc kết nối hệ thống AI đang bị lỗi.</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button className="h-10 px-4 rounded-lg border border-[#2F9E44] text-[#2F9E44] text-[14px] font-[500] hover:bg-[#E6F4EA] transition-colors flex items-center gap-2 cursor-pointer">
                      Xem chi tiết phác đồ <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
