import axiosClient from "@/lib/axiosClient";
import { BaseResponse } from "@/types/common.type";
import {
  CreateFeedbackDto,
  FeedbackItem,
  ProcessFeedbackDto,
} from "@/types/feedback.type";

export const feedbackService = {
  submit: async (
    payload: CreateFeedbackDto,
  ): Promise<BaseResponse<FeedbackItem>> => {
    const response = await axiosClient.post<BaseResponse<FeedbackItem>>(
      "/feedbacks",
      payload,
    );
    return response.data;
  },

  getMyFeedbacks: async (): Promise<BaseResponse<FeedbackItem[]>> => {
    const response = await axiosClient.get<BaseResponse<FeedbackItem[]>>(
      "/feedbacks/my-feedbacks",
    );
    return response.data;
  },

  getAll: async (): Promise<BaseResponse<FeedbackItem[]>> => {
    const response =
      await axiosClient.get<BaseResponse<FeedbackItem[]>>("/feedbacks");
    return response.data;
  },

  process: async (
    id: string,
    payload: ProcessFeedbackDto,
  ): Promise<BaseResponse<FeedbackItem>> => {
    const response = await axiosClient.patch<BaseResponse<FeedbackItem>>(
      `/feedbacks/${id}/process`,
      payload,
    );
    return response.data;
  },
};
