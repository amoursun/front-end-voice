import {memo} from 'react';
import {Button, Modal, Form, Input} from 'antd';
import {useResetFormOnCloseModal} from './useResetFormOnCloseModal';

export interface UserFieldType {
  room: string;
  user: string;
};

interface ModalFormProps {
  open: boolean;
  onCancel?: () => void;
}
export const FormModal = memo((props: ModalFormProps) => {
    const { open, onCancel } = props;
    const [form] = Form.useForm();
    useResetFormOnCloseModal({
        form,
        open: open,
    });
    const onSubmit = () => {
      form.submit();
    };
  
    return (
      <Modal
          title="窗口"
          open={open}
          closable={false}
          footer={[
              <Button key="submit" type="primary" onClick={onSubmit}>
                  提交
              </Button>
          ]}
        >
            
            <Form
                form={form}
                name="userForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
            >
                <Form.Item<UserFieldType>
                    label="房间名称"
                    name="room"
                    rules={[{required: true, message: '请输入房间名称'}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<UserFieldType>
                  label="你的名字"
                  name="user"
                  rules={[{required: true, message: '请输入你的名字'}]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
});

