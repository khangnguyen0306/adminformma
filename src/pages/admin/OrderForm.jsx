import { Button, Form, InputNumber, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useGetAllFlowersQuery } from "../../services/flowerApi";
import { useGetAllUserQuery } from "../../services/userAPI";
import {
  useCreateOrderMutation,
  useEditOrderMutation,
  useGetAllOrderQuery,
} from "../../services/orderApi";

const OrderForm = ({ handleCloseModal, form, selectedOrder }) => {
  const [maxQuantity, setMaxQuantity] = useState(9999);
  const { data: flowers, isLoading: isLoadingFlowers } = useGetAllFlowersQuery();
  const { data: users, isLoading: isLoadingUsers } = useGetAllUserQuery();
  const { refetch } = useGetAllOrderQuery();
  const [createOrder, { isLoading: loadingCreate }] = useCreateOrderMutation();
  const [editOrder, { isLoading: loadingEdit }] = useEditOrderMutation();

  useEffect(() => {
    form.resetFields();
  }, [selectedOrder]);

  const handleFlowerSelect = (flowerId) => {
    const selectedFlower = flowers.find((flower) => flower._id === flowerId);
    setMaxQuantity(selectedFlower?.quantity || 0);
    form.setFieldsValue({ quantity: null });
  };

  const handleCreateOrder = async (values) => {
    try {
      await createOrder(values).unwrap();
      message.success("Order created successfully!");
      refetch();
      handleCloseModal();
      form.resetFields();
    } catch (error) {
      message.error("Failed to create order: " + (error.data?.message || "An unknown error occurred"));
    }
  };

  const handleEditOrder = async (values) => {
    try {
      const id = selectedOrder._id;
      const body = {
        quantity: values?.quantity,
        status: selectedOrder?.status,
      };
      await editOrder({ id, body }).unwrap();
      message.success("Order updated successfully!");
      refetch();
      handleCloseModal();
      form.resetFields();
    } catch (error) {
      message.error("Failed to update order: " + (error.data?.message || "An unknown error occurred"));
    }
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={selectedOrder ? handleEditOrder : handleCreateOrder}
    >
    {selectedOrder ? "" : (<>
      <Form.Item
        name="flowerId"
        label="Select Flower"
        rules={[{ required: true, message: "Please select a flower!" }]}
        hidden={Boolean(selectedOrder)}
      >
        <Select
          loading={isLoadingFlowers}
          placeholder="Choose a flower"
          options={flowers?.map((flower) => ({
            label: flower?.name,
            value: flower?._id,
          }))}
          onChange={handleFlowerSelect}
        />
      </Form.Item>

      <Form.Item
        name="buyerId"
        label="Select User"
        rules={[{ required: true, message: "Please select a user!" }]}
        hidden={Boolean(selectedOrder)}
      >
        <Select
          loading={isLoadingUsers}
          placeholder="Choose a user"
          options={users?.map((user) => ({
            label: user?.name,
            value: user?._id,
          }))}
        />
      </Form.Item>

    </>)}
     
      <Form.Item
        name="quantity"
        label="Quantity"
        rules={
          selectedOrder
            ? null
            : [
                { required: true, message: "Please enter a quantity!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value <= maxQuantity) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(`Quantity cannot exceed ${maxQuantity}`));
                  },
                }),
              ]
        }
        initialValue={selectedOrder?.quantity || 1}
      >
        <InputNumber min={1} max={maxQuantity} placeholder="Enter quantity" />
      </Form.Item>

      <Form.Item>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loadingCreate || loadingEdit}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;
