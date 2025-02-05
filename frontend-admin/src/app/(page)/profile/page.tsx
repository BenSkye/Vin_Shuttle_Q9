'use client'
import { Layout, Card, Avatar, Button, Form, Input, notification, Tabs, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import Sidebar from '../../_components/common/Sidebar';
import { useEffect, useState, useCallback } from 'react';
import { usersService } from '../../services/usersServices';

const { Header, Content } = Layout;


interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface InfoFormValues {
  name: string;
  email: string;
  phone: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [infoForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersService.getUserProfile();
      setProfile(data);
      infoForm.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.phone
      });
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      notification.error({
        message: 'Lỗi',
        description: err.response?.data?.message || err.message || 'Không thể tải thông tin profile',
        duration: 5,
        placement: 'topRight'
      });
    } finally {
      setLoading(false);
    }
  }, [infoForm]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onInfoFinish = async (values: InfoFormValues) => {
    console.log('Info Update:', values);
  };

  const onPasswordFinish = async (values: PasswordFormValues) => {
    console.log('Password Update:', values);
  };


  return (
    <Layout hasSider>
      <Sidebar />
      <Layout>
        <Header className="bg-white p-4">
          <h2 className="text-xl font-semibold ml-7">Trang cá nhân</h2>
        </Header>
        <Content className="m-6">
          <Spin spinning={loading} tip="Đang tải...">
            <div className="max-w-3xl mx-auto">
              {/* Thông tin cơ bản */}
              <Card className="mb-6">
                <div className="flex items-center mb-6">
                  <Avatar 
                    size={100} 
                    icon={<UserOutlined />}
                    className="mr-6"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{profile?.name}</h3>
                    <p className="text-gray-500">Administrator</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MailOutlined className="mr-2" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneOutlined className="mr-2" />
                    <span>{profile?.phone}</span>
                  </div>
                </div>
              </Card>

              {/* Tabs chỉnh sửa thông tin */}
              <Card>
                <Tabs 
                  defaultActiveKey="info" 
                  items={[
                    {
                      key: 'info',
                      label: 'Thông tin cá nhân',
                      children: (
                        <Form
                          form={infoForm}
                          layout="vertical"
                          onFinish={onInfoFinish}
                        >
                          <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                          >
                            <Input prefix={<UserOutlined />} />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: 'Vui lòng nhập email!' },
                              { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                          >
                            <Input prefix={<MailOutlined />} />
                          </Form.Item>

                          <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                              { required: true, message: 'Vui lòng nhập số điện thoại!' },
                              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                            ]}
                          >
                            <Input prefix={<PhoneOutlined />} />
                          </Form.Item>

                          <Form.Item>
                            <Button type="primary" htmlType="submit">
                              Cập nhật thông tin
                            </Button>
                          </Form.Item>
                        </Form>
                      )
                    },
                    {
                      key: 'password',
                      label: 'Đổi mật khẩu',
                      children: (
                        <Form
                          form={passwordForm}
                          layout="vertical"
                          onFinish={onPasswordFinish}
                        >
                          <Form.Item
                            name="currentPassword"
                            label="Mật khẩu hiện tại"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                          >
                            <Input.Password prefix={<LockOutlined />} />
                          </Form.Item>

                          <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[
                              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                          >
                            <Input.Password prefix={<LockOutlined />} />
                          </Form.Item>

                          <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            dependencies={['newPassword']}
                            rules={[
                              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                              }),
                            ]}
                          >
                            <Input.Password prefix={<LockOutlined />} />
                          </Form.Item>

                          <Form.Item>
                            <Button type="primary" htmlType="submit">
                              Đổi mật khẩu
                            </Button>
                          </Form.Item>
                        </Form>
                      )
                    }
                  ]}
                />
              </Card>
            </div>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
}