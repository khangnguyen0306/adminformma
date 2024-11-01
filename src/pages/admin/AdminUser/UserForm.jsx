import { Button, Form, Input, InputNumber, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  // useCreateUserMutation,
  useGetAllUserQuery,
  // useEditUserMutation,
  // useGetAllUserQuery,
} from "../../../services/userAPI";
import { useGetAllRoleQuery } from "../../../services/roleApi";

const UserForm = ({ handleCloseModal, form, selectedUser }) => {
  const [maxQuantity, setMaxQuantity] = useState(null);
  // const [createOrder, { isLoading: loadingCreate }] = useCreateUserMutation();
  // const [editUser, { isLoading: loadingEdit }] = useEditUserMutation();
  const { data: users, error, isLoading, refetch } = useGetAllUserQuery();
  const {
    data: roles,
    errorRole,
    isLoadingRole,
    refetchRole,
  } = useGetAllRoleQuery();

  useEffect(() => {
    form.resetFields();
  }, [selectedUser]);

  const handleCreateUser = async (values) => {
    try {
      // await createOrder(values).unwrap();
      message.success("Flower created successfully!");
      refetch();
      handleCloseModal();
      form.resetFields();
    } catch (error) {
      message.error(
        "Failed to create user: " +
          (error.data?.message || "An unknown error occurred")
      );
    }
  };

  const handleEditUser = async (values) => {
    try {
      // await editUser({
      //   id: selectedUser._id,
      //   body: { ...values },
      // })
      //   .unwrap()
      //   .then(() => {
      //     message.success("User updated successfully!");
      //     handleCloseModal();
      //     refetch();
      //   });
    } catch (error) {
      message.error(
        "Failed to create user: " +
          (error.data?.message || "An unknown error occurred")
      );
    }
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={selectedUser ? handleEditUser : handleCreateUser}
      initialValues={selectedUser ? selectedUser : null}
    >
      <Form.Item
        name="name"
        label="User Name"
        rules={[{ required: true, message: "Please select a flower!" }]}
      >
        <Input placeholder="Enter your name"></Input>
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please enter your email!" }]}
      >
        <Input placeholder="Enter your email"></Input>
      </Form.Item>
      {selectedUser ? (
        ""
      ) : (
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input type="password" placeholder="Enter your password"></Input>
        </Form.Item>
      )}

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: "Please enter your address!" }]}
      >
        <Input placeholder="Enter your address"></Input>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="Role"
        rules={[{ required: true, message: "Please select your role!" }]}
      >
        <Select
          placeholder="Select your role"
          options={
            roles?.map((role) => ({ value: role._id, label: role.name })) || []
          }
        ></Select>
      </Form.Item>
      <Form.Item>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            // loading={isLoading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
