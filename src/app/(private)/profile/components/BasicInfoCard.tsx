import { Alert, Card, Col, Form, Input, Row } from "antd";

import { User } from "@/types/auth.type";

interface BasicInfoCardProps {
  user: User | null;
  profileError: string | null;
}

export function BasicInfoCard({ user, profileError }: BasicInfoCardProps) {
  return (
    <Card
      className="rounded-2xl border-[var(--border)] bg-[var(--bg-card)] shadow-sm transition-colors duration-200 hover:shadow-md"
      title={
        <span className="text-lg font-bold text-[var(--text-primary)]">
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
              <span className="font-medium text-[var(--text-secondary)]">
                Họ & tên đệm
              </span>
            }
            name="lastName"
            rules={[{ required: true, message: "Vui lòng nhập Họ" }]}
          >
            <Input
              placeholder="Nguyễn Văn"
              className="rounded-xl text-base sm:text-sm"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={
              <span className="font-medium text-[var(--text-secondary)]">
                Tên
              </span>
            }
            name="firstName"
            rules={[{ required: true, message: "Vui lòng nhập Tên" }]}
          >
            <Input
              placeholder="A"
              className="rounded-xl text-base sm:text-sm"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={
              <span className="font-medium text-[var(--text-secondary)]">
                Tên đăng nhập
              </span>
            }
          >
            <Input
              value={user?.username}
              disabled
              className="cursor-not-allowed rounded-xl text-base sm:text-sm"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={
              <span className="font-medium text-[var(--text-secondary)]">
                Email
              </span>
            }
          >
            <Input
              value={user?.email}
              disabled
              className="cursor-not-allowed rounded-xl text-base sm:text-sm"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={
              <span className="font-medium text-[var(--text-secondary)]">
                Số điện thoại
              </span>
            }
            name="phone"
          >
            <Input
              placeholder="0987654321"
              className="rounded-xl text-base sm:text-sm"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
