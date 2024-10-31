import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Upload, message, Skeleton } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEditFlowerMutation, useGetFlowesDetailsQuery } from '../../../services/flowerApi';

const EditFlower = ({ flower, onClose, refetch, onCreate }) => {
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const [editFlower, { isLoading }] = useEditFlowerMutation();
    const { data: flowerData, isLoading: isLoadingData } = useGetFlowesDetailsQuery(flower);

    useEffect(() => {
        if (flower && flowerData) {
            form.setFieldsValue(flowerData);
            if (flowerData.imageUrl) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'flower-image',
                        status: 'done',
                        url: flowerData.imageUrl,
                    },
                ]);
            }
        } else {
            form.resetFields();
        }
    }, [flowerData, form]);

    const onFinish = async (values) => {
        console.log('Received values:', { ...values, file: fileList[0]?.originFileObj });
        if (flower) {
            try {
                await editFlower({
                    id: flower,
                    body: { ...values, file: fileList[0]?.originFileObj }
                }).unwrap().then(() => {
                    message.success('Flower updated successfully!');
                    onClose();
                    refetch();
                });

            } catch (error) {
                console.log(error);
                message.error('Failed to update flower: ' + error.data.message);
            }
        } else {

            const newFlowerData = {
                ...values,
                file: fileList[0]?.originFileObj
            };

            onCreate(newFlowerData);

        }

    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    if (isLoadingData)
        return (
            <Skeleton active />
        )

    return (
        <Form
            name="edit_flower"
            form={form}
            onFinish={onFinish}
        >
            <Form.Item
                name="name"
                label="Flower Name"
                rules={[{ required: true, message: 'Please input the flower name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please input the flower type!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please input the quantity!' }]}
            >
                <InputNumber className='w-full' min={1} />
            </Form.Item>
            <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please input the price!' }]}
            >
                <InputNumber
                    className='w-full'
                    min={0}
                    formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/₫\s?|(,*)/g, '')}
                />
            </Form.Item>
            <Form.Item
                name="condition"
                label="Condition"
                rules={[{ required: true, message: 'Please input the condition!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="description"
                label="Description"
            >
                <Input.TextArea style={{ minHeight: '100px' }} />
            </Form.Item>
            <Form.Item
                label="Image"
                name="imageUrl"
            >
                <Upload
                    name="image"
                    listType="picture"
                    beforeUpload={beforeUpload}
                    onChange={handleUploadChange}
                    fileList={fileList}
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit" size='large' loading={isLoading}>
                        Submit
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default EditFlower;