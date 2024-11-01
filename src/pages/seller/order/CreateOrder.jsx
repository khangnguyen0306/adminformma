import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, Button, message, Skeleton, Tooltip, Image, Card, ConfigProvider } from 'antd';
import { useGetAllFlowersQuery } from '../../../services/flowerApi';
import { useGetAllUserQuery } from '../../../services/userAPI';
import { useCreateOrderMutation } from '../../../services/orderApi';
import { PlusCircleFilled } from '@ant-design/icons';

const CreateOrder = ({ onClose, refetch }) => {
  const [form] = Form.useForm();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const { data: flowers, isLoading: isLoadingFlowers } = useGetAllFlowersQuery();
  const { data: users, isLoading: isLoadingUsers } = useGetAllUserQuery();
  console.log(users)
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);

  // Watch for flower selection changes and update max quantity
  const handleFormChange = (changedValues) => {
    if (changedValues.flowerId) {
      const selectedFlower = flowers?.find(flower => flower._id === changedValues.flowerId);
      setMaxQuantity(selectedFlower ? selectedFlower.quantity : null);
      setImage(selectedFlower.imageUrl)

    }
    if (changedValues.buyerId) {
      const selectedUser = users?.find(buyer => buyer._id === changedValues.buyerId);
      setUserData(selectedUser)
    }
  };

  const onFinish = async (values) => {
    console.log(values)
    try {
      await createOrder(values).unwrap();
      message.success('Order created successfully!');
      form.resetFields();
      setMaxQuantity(null)
      setImage(null)
      setUserData(null)
      onClose();
      refetch();
    } catch (error) {
      console.error('Failed to create order:', error);
      message.error('Failed to create order: ' + (error.data?.message || 'Unknown error'));
    }
  };

  if (isLoadingFlowers || isLoadingUsers) return <Skeleton active />;

  return (
    <Form
      form={form}
      name="create_order"
      onFinish={onFinish}
      layout="vertical"
      onValuesChange={handleFormChange}
    >
      <Form.Item
        name="buyerId"
        label="Buyer"
        rules={[{ required: true, message: 'Please select a buyer!' }]}
      >
        <Select
          showSearch
          placeholder="Select a buyer"
          optionLabelProp='label'
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          options={users?.map(user => ({
            value: user._id,
            label: (
              <Tooltip title={`Name: ${user.name}`}>
                {user.email}
              </Tooltip>
            ),
            children: user.email
          }))}
        />
      </Form.Item>
      {userData && (
        <>
          <ConfigProvider
            theme={{
              components: {
                Card: {
                  headerBg: '#e2ebea'
                },
              },
            }}
          >
            <Card title={"Id :" + userData._id} className='flex flex-col justify-center my-8 shadow-lg'>

              <p><strong>Name : </strong>{userData.name} </p>
              <p><strong>PhoneNumber : </strong>{userData.phoneNumber} </p>
              <p><strong>Email: </strong>{userData.email} </p>
              <p><strong>Adress: </strong>{userData.address} </p>
            </Card >
          </ConfigProvider>

        </>
      )}
      <Form.Item
        name="flowerId"
        label="Flower"
        rules={[{ required: true, message: 'Please select a flower!' }]}
      >
        <Select
          showSearch
          placeholder="Select a flower"
          optionLabelProp='label'
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          options={flowers
            ?.filter(flower => flower.quantity > 0)
            .map(flower => ({
              value: flower._id,
              label: (
                <Tooltip title={`ID: ${flower._id}`}>
                  {flower.name}
                </Tooltip>
              ),
              children: flower.name
            }))}
        />
      </Form.Item>
      <div className='flex justify-center my-8'>
        <Image src={image ? (`http://localhost:8000/` + image) : null} width={200} className='shadow-lg' />
      </div>
      <Form.Item
        name="quantity"
        label={
          <p>Quantity of flowers available :<span className='text-green-600 text-bold text-xl '> {maxQuantity}</span></p>}
        rules={[
          { required: true, message: 'Please enter the quantity!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              const flowerId = getFieldValue('flowerId');
              const selectedFlower = flowers?.find(flower => flower._id === flowerId);
              if (!selectedFlower || value <= selectedFlower.quantity) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(`Maximum quantity is ${selectedFlower.quantity}`));
            },
          }),
        ]}
      >
        <InputNumber min={1} className="w-full" />
      </Form.Item>


      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" icon={<PlusCircleFilled />} htmlType="submit" loading={isCreating} size="large">
            Create Order
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CreateOrder;
