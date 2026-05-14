import { DiagnosisResponse } from "./diagnose.type";

export interface FeedbackActualDiseaseItem {
  id: string;
  feedbackId: string;
  diseaseId: string;
  disease: {
    id: string;
    name: string;
  };
}

export interface FeedbackItem {
  id: string;
  diagnosisId: string;
  diagnosis?: DiagnosisResponse;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  userMessage?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  adminId?: string;
  adminResponse?: string;
  processedAt?: string;
  createdAt: string;
  actualDiseases?: FeedbackActualDiseaseItem[];
}

export interface CreateFeedbackDto {
  diagnosisId: string;
  userMessage?: string;
  actualDiseaseIds: string[];
}

export interface ProcessFeedbackDto {
  status: "ACCEPTED" | "REJECTED";
  response?: string;
}
