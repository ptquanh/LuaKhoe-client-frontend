export interface AiModel {
  id: string;
  versionName: string;
  filePath: string;
  releaseNotes?: string;
  isActive: boolean;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAiModelPayload {
  versionName: string;
  filePath: string;
  releaseNotes?: string;
  isActive?: boolean;
}
