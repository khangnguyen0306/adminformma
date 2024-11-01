import { DeleteFilled, EditFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Space, Table, Tooltip } from "antd";
import React, { useState } from "react";
import Highlighter from "react-highlight-words";
import { useDeleteUserMutation, useGetAllUserQuery} from "../../../services/userAPI";
import UserForm from "./UserForm";
// import OrderForm from "./OrderForm";

const AdminUser = () => {
  let searchInput = null;
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const { data: users, error, isLoading, refetch } = useGetAllUserQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    handleSearch("", confirm, "");
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    form.resetFields()
};

const confirmDeleteUser = (user) => {
  Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa user này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
          try {
              await deleteUser(user._id).unwrap();
              message.success('Xóa user thành công');
              refetch();
          } catch (error) {
              message.error('Xóa user thất bại');
          }
      },
  });
};

  const filteredUsers = users?.filter(users => !users.isDeleted);


  const columns = [
    {
      title: "User ID",
      dataIndex: "_id",
      key: "_id",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "User Name",
      dataIndex:"name", 
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
    },
    {
      title: "User's Email",
      dataIndex: "email", 
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === "buyerEmail" && sortedInfo.order,
    },
    {
      title: "User's address",
      dataIndex: "address", 
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
        title: "User's Number",
        dataIndex: "phoneNumber", 
        key: "phoneNumber",
        ...getColumnSearchProps("phoneNumber"),
      },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa" color="blue">
            <Button
              type="primary"
              icon={<EditFilled />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa" color="red">
            <Button
              type="primary"
              danger
              icon={<DeleteFilled />}
              onClick={() => confirmDeleteUser(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];


  return (
    <div className="flex flex-col items-start w-full">
    
      <div className="flex w-full justify-end mb-5">
        <Button
          type="primary"
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-blue-500 h-[40px] to-cyan-400 text-white font-medium rounded-full  transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg flex items-center"
        >
          <p>
            <PlusOutlined /> Thêm user mới
          </p>
        </Button>
      </div>
      <Table className="w-full" 
        columns={columns}
        dataSource={filteredUsers}
      />
      <Modal
                title={<p className='w-full text-center mb-7'>{selectedUser? 'Chỉnh sửa user' : 'Tạo user mới'}</p>}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <UserForm  handleCloseModal={handleCloseModal} form={form} selectedUser={selectedUser}/> 
            </Modal>
    </div>
  );
};

export default AdminUser;
