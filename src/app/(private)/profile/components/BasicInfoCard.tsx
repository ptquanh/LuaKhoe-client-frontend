import React from "react";
import { Card, Form, Input, Row, Col, Alert } from "antd";
import { User } from "@/types/auth.type";

interface BasicInfoCardProps {
  user: User | null;
  profileError: string | null;
}

export function BasicInfoCard({ user, profileError }: BasicInfoCardProps) {
  return (
    <Card
      className="rounded-2xl border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
      title={
        <span className="text-lg font-bold text-gray-800">
          Thông tin cơ bản
        </span>
      }
    >
      {profileError && (
        <Alert
          message={profileError}
          type="error"
          showIcon
          className="mb-6 rounded-lg font-medium"
        />
      )}

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={
              <span className="font-medium text-gray-700">Họ & tên đệm</span>
            }
            name="lastName"
            rules={[{ required: true, message: "Vui lòng nhập Họ" }]}
          >
            <Input placeholder="Nguyễn Văn" className="rounded-lg" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={<span className="font-medium text-gray-700">Tên</span>}
            name="firstName"
            rules={[{ required: true, message: "Vui lòng nhập Tên" }]}
          >
            <Input placeholder="A" className="rounded-lg" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={
              <span className="font-medium text-gray-700">Tên đăng nhập</span>
            }
          >
            <Input
              value={user?.username}
              disabled
              className="cursor-not-allowed rounded-lg bg-gray-50 text-gray-500"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={<span className="font-medium text-gray-700">Email</span>}
          >
            <Input
              value={user?.email}
              disabled
              className="cursor-not-allowed rounded-lg bg-gray-50 text-gray-500"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
