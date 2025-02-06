import { Modal, Form, Select, InputNumber, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PricingConfig } from '../../services/interface';

interface UpdatePriceProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: any;
  categories: { [key: string]: string };
  serviceConfigs: PricingConfig[];
  serviceTypeMap: { [key: string]: string };
}

export default function UpdatePrice({ 
  visible, 
  onCancel, 
  onOk, 
  form, 
  categories, 
  serviceConfigs,
  serviceTypeMap 
}: UpdatePriceProps) {
  return (
    <Modal
      title="Cập nhật giá dịch vụ"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={800}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="vehicle_category"
          label="Danh mục xe"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục xe' }]}
        >
          <Select
          disabled
            placeholder="Chọn danh mục xe"
            options={Object.entries(categories).map(([id, name]) => ({
              value: id,
              label: name
            }))}
          />
        </Form.Item>

        <Form.Item
          name="service_config"
          label="Loại dịch vụ"
          rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ' }]}
        >
          <Select
          disabled
            placeholder="Chọn loại dịch vụ"
            options={serviceConfigs.map(config => ({
              value: config._id,
              label: serviceTypeMap[config.service_type] || config.service_type
            }))}
          />
        </Form.Item>

        <Form.List name="tiered_pricing">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'range']}
                    rules={[{ required: true, message: 'Nhập khoảng' }]}
                  >
                    <InputNumber placeholder="Khoảng" min={0} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'price']}
                    rules={[{ required: true, message: 'Nhập giá' }]}
                  >
                    <InputNumber 
                      placeholder="Giá" 
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      // @ts-ignore
                      parser={value => parseFloat(value!.replace(/\$\s?|(,*)/g, ''))}
                      style={{ width: '200px' }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm khoảng giá
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
