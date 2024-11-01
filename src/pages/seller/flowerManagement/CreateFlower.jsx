import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { useCreateflowerMutation } from '../../../services/flowerApi';


const CreateFlower = ({ onClose, refetch }) => {
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const [createFlower, { isLoading: loadingCreate }] = useCreateflowerMutation();

    const onFinish = async (values) => {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('type', values.type);
        formData.append('quantity', values.quantity);
        formData.append('price', values.price);
        formData.append('condition', values.condition);
        formData.append('description', values.description || '');


        if (fileList.length > 0) {
            formData.append('file', fileList[0].originFileObj);
        }

        try {
            await createFlower(formData).unwrap();
            message.success('Flower created successfully!');
            onClose();
            refetch();
            form.resetFields()
        } catch (error) {
            console.log(error);
            message.error('Failed to create flower: ' + (error.data?.message || 'Unknown error'));
        }
    };


    const handleUploadChange = (files) => {
        if (files.length > 0) {
            const newFileList = Array.from(files).map(file => ({
                originFileObj: file,
                name: file.name,
                status: 'done',
            }));
            setFileList(newFileList);
        }
    };



    return (
        <Form
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            name="create_flower"
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
                <Input
                    type="file"
                    onChange={(e) => handleUploadChange(e.target.files)}
                />
            </Form.Item>
            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit" size='large' loading={loadingCreate}>
                        Submit
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default CreateFlower;
