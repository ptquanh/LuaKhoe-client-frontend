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
    username: string;
    email: string;
    farmerProfile?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
  };
  rating?: number;
  content?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminId?: string;
  adminResponse?: string;
  processedAt?: string;
  createdAt: string;
  actualDiseases?: FeedbackActualDiseaseItem[];
}

export interface CreateFeedbackDto {
  diagnosisId: string;
  rating: number;
  content?: string;
  actualDiseaseIds: string[];
}

export interface ProcessFeedbackDto {
  status: "APPROVED" | "REJECTED";
  response?: string;
}
