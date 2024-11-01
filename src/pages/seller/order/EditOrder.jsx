import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, Button, message, Skeleton } from 'antd';
import { useEditOrderMutation, useGetOrderDetailsQuery } from '../../../services/orderApi';

const EditOrder = ({ orderId, onClose, refetch }) => {
    const { data: order, isLoading: isLoadingOrder } = useGetOrderDetailsQuery(orderId);
    const [form] = Form.useForm();
    const [updateOrder, { isLoading: isUpdating }] = useEditOrderMutation();
    const [maxQuantity, setMaxQuantity] = useState(null);

    // Set initial form values and max quantity based on flower data in order
    useEffect(() => {
        if (order) {
            form.setFieldsValue({
                quantity: order.quantity,
                status: order.status,
            });
            setMaxQuantity(order.flowerId?.quantity || 0);
        }
    }, [order, form]);

    const onFinish = async (values) => {
        try {
            await updateOrder({ body: { ...values }, id: orderId }).unwrap();
            message.success('Order updated successfully!');
            onClose();
            refetch();
        } catch (error) {
            console.error('Failed to update order:', error);
            message.error('Failed to update order: ' + (error.data?.message || 'Unknown error'));
        }
    };

    if (isLoadingOrder) return <Skeleton active />;

    return (
        <Form
            form={form}
            name="edit_order"
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item
                name="quantity"
                label={<p>Quantity Available: <span className={`text-lg font-bold ${maxQuantity == 0 ? "text-red-600" : "text-green-600"}`}> {maxQuantity}</span></p>}
                rules={[
                    { required: true, message: 'Please enter the quantity!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (value <= maxQuantity) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum quantity is ${maxQuantity}`));
                        },
                    }),
                ]}
            >
                <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select the status!' }]}
            >
                <Select placeholder="Select status">
                    <Select.Option value="Đang xử lý">Đang xử lý</Select.Option>
                    <Select.Option value="Đã giao">Đã giao</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={isUpdating} size="large">
                        Update Order
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default EditOrder;
