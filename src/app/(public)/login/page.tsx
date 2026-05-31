"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Typography,
} from "antd";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { ACCESS_TOKEN } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { getErrorMessage, useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { LoginPayload, ROLE } from "@/types/auth.type";

const { Title, Text } = Typography;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, login, loginWithGoogle, isLoading, error, setError } =
    useAuth();
  const [form] = Form.useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === ROLE.ADMIN) {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(ROUTES.DIAGNOSE);
      }
    }
  }, [user, router]);

  // Handle Google OAuth query parameters callback
  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");
    const code = searchParams.get("code");

    if (token) {
      setCookie(ACCESS_TOKEN, token, {
        maxAge: 60 * 60 * 24 * 7,
      });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      router.replace(ROUTES.LOGIN);
    } else if (code) {
      const exchangeCode = async () => {
        setError(null);
        try {
          const res = await authService.socialLoginCallback("GOOGLE", code);
          if (res.success && res.data?.accessToken) {
            setCookie(ACCESS_TOKEN, res.data.accessToken, {
              maxAge: 60 * 60 * 24 * 7,
            });
            await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
          } else {
            setError(res.message || "Đăng nhập Google thất bại.");
          }
        } catch (err: any) {
          setError(getErrorMessage(err));
        } finally {
          router.replace(ROUTES.LOGIN);
        }
      };
      exchangeCode();
    } else if (errorParam) {
      let friendlyError = decodeURIComponent(errorParam);
      if (friendlyError.includes("password must be longer")) {
        friendlyError = "Mật khẩu đăng nhập phải từ 8 ký tự trở lên.";
      } else if (friendlyError.toLowerCase().includes("password incorrect")) {
        friendlyError = "Mật khẩu không chính xác.";
      }
      setError(friendlyError);
      router.replace(ROUTES.LOGIN);
    }
  }, [searchParams, router, queryClient, setError]);

  const onFinish = async (values: {
    usernameOrEmail: string;
    password: string;
    remember?: boolean;
  }) => {
    const payload: LoginPayload = {
      usernameOrEmail: values.usernameOrEmail,
      password: values.password,
    };

    await login(payload);
  };

  return (
    <main className="flex min-h-screen bg-white">
      {/* Left side: Image banner (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-end overflow-hidden p-12 lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/background-login.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-lg text-white">
          <h1 className="mb-4 text-4xl leading-tight font-bold">
            Chẩn đoán bệnh lúa
            <br />
            bằng trí tuệ nhân tạo
          </h1>
          <p className="text-lg text-gray-200">
            Bảo vệ mùa màng với công nghệ AI tiên tiến
          </p>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex w-full items-center justify-center p-8 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <div className="mb-8 flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="text-lg font-bold text-green-800">Lúa Khoẻ</span>
            </div>
            <Title level={2} className="mb-2! text-gray-800!">
              Đăng nhập
            </Title>
            <Text className="text-gray-500">Chào mừng bạn trở lại!</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-6 rounded-lg font-medium"
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
            requiredMark={false}
          >
            <Form.Item
              label={
                <span className="font-medium text-gray-700">
                  Email hoặc tên đăng nhập
                </span>
              }
              name="usernameOrEmail"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email hoặc tên đăng nhập",
                },
              ]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập email hoặc tên đăng nhập"
                className="h-11 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Mật khẩu</span>
              }
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              className="mb-5"
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                className="h-11 rounded-lg"
              />
            </Form.Item>

            <div className="mb-6 flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-500">Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>

              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                style={{
                  backgroundColor: "#22c55e",
                  borderColor: "#22c55e",
                }}
                className="h-12 rounded-lg text-base font-medium shadow-sm hover:border-green-600! hover:bg-green-600!"
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Divider className="my-6">Hoặc tiếp tục với</Divider>

            <Button
              block
              size="large"
              onClick={loginWithGoogle}
              icon={
                <svg className="mr-2 inline-block h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887C18.2 16.8 15.645 18.4 12.24 18.4c-3.53 0-6.4-2.87-6.4-6.4s2.87-6.4 6.4-6.4c1.53 0 2.93.54 4.03 1.43l3.033-3.033C17.415 2.155 14.99 1.2 12.24 1.2c-5.965 0-10.8 4.835-10.8 10.8s4.835 10.8 10.8 10.8c6.225 0 10.335-4.38 10.335-10.515 0-.705-.06-1.39-.18-2.015H12.24z"
                  />
                </svg>
              }
              className="mb-6 h-12 rounded-lg border-gray-300 font-medium shadow-sm hover:bg-gray-50!"
            >
              Đăng nhập bằng Google
            </Button>

            <div className="text-center">
              <Text className="text-gray-500">Chưa có tài khoản? </Text>
              <Link
                href={ROUTES.REGISTER}
                className="font-medium text-green-600 hover:text-green-700"
              >
                Đăng ký ngay
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <span className="animate-bounce text-4xl">🌱</span>
            <p className="mt-2 font-medium text-gray-500">Đang tải...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
