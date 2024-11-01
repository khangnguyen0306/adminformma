import { DeleteFilled, EditFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Space, Table, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import Highlighter from "react-highlight-words";
import { useDeleteOrderMutation, useEditOrderMutation, useGetAllOrderQuery } from "../../services/orderApi";
import OrderForm from "./OrderForm";

const Admin = () => {
  let searchInput = null;
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const { data: orders, error, isLoading, refetch } = useGetAllOrderQuery();
  const [deleteOrder, { isLoading: loadingDelete }] = useDeleteOrderMutation();
  const [editOrder, { isLoadingOrder }] = useEditOrderMutation();
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
    setSelectedOrder(null);
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    form.resetFields()
};
const handleEditOrder = (flower) => {
  setSelectedOrder(flower);
  setIsModalVisible(true);
};

const confirmChangeOrder = (order) => {
  Modal.confirm({
    title: 'Xác nhận chuyển sang đã xác nhận',
    content: 'Bạn có chắc chắn muốn chuyển order này sang đã xác nhận?',
    okText: 'Chuyển',
    okType: 'primary',
    cancelText: 'Hủy',
    onOk: async () => {
        try {
            const id = order._id
            const body = {
              quantity : order.quantity,
              status: "Đã xác nhận"
            }
            await editOrder({id, body}).unwrap();
            message.success('Xác nhận thành công');
            refetch();
        } catch (error) {
            message.error('Xác nhận thất bại');
        }
    },
});
}

const confirmDeleteOrder = (order) => {
  Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa order này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
          try {
              await deleteOrder(order._id).unwrap();
              message.success('Xóa order thành công');
              refetch();
          } catch (error) {
              message.error('Xóa order thất bại');
          }
      },
  });
};

  const filteredOrders = orders?.filter(orders => !orders.isDeleted);


  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "Buyer Name",
      dataIndex: ["buyerId", "name"], 
      key: "buyerName",
      ...getColumnSearchProps(["buyerId", "name"]),
      sorter: (a, b) => a.buyerId.name.localeCompare(b.buyerId.name),
      sortOrder: sortedInfo.columnKey === "buyerName" && sortedInfo.order,
    },
    {
      title: "Buyer's Email",
      dataIndex: ["buyerId", "email"], 
      key: "buyerEmail",
      ...getColumnSearchProps(["buyerId", "email"]),
      sorter: (a, b) => a.buyerId.email.localeCompare(b.buyerId.email),
      sortOrder: sortedInfo.columnKey === "buyerEmail" && sortedInfo.order,
    },
    {
      title: "Flower's ID",
      dataIndex: ["flowerId", "_id"], 
      key: "flowerId",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "Flower's Name",
      dataIndex: ["flowerId", "name"], 
      key: "flowerName",
      ...getColumnSearchProps(["flowerId", "name"]),
      sorter: (a, b) => a.flowerId.name.localeCompare(b.flowerId.name),
      sortOrder: sortedInfo.columnKey === "flowerName" && sortedInfo.order,
    },
    {
      title: "Flower's Type",
      dataIndex: ["flowerId", "type"], 
      key: "type",
      ...getColumnSearchProps(["flowerId", "type"]),
      sorter: (a, b) => a.quantity - b.quantity,
      sortOrder: sortedInfo.columnKey === 'type' && sortedInfo.order,
    },
    {
      title: "Quantity",
      dataIndex:"quantity", 
      key: "quantity",
      ...getColumnSearchProps("quantity"),
      sorter: (a, b) => a.quantity - b.quantity,
      sortOrder: sortedInfo.columnKey === 'quantity' && sortedInfo.order,
    },
    {
      title: "Status",
      dataIndex:"status", 
      key: "status",
      ...getColumnSearchProps("status"),
      sorter: (a, b) => a.status - b.status,
      sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
      render:(record) =>{
        return <Tag color={record === "Đang xử lý" ? "" : record === "Đang giao" ? "yellow" : record === "Đã xác nhận" ? "orangered" : "green"}>{record}</Tag>
      }
    },
    {
      title: "",
      key: "statusAction",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chuyển trạng thái" color="#ffde21">
            <Button
              type="primary"
              style={{background:"#ffde21"}}
              onClick={() => confirmChangeOrder(record)}
            >Chuyển</Button>
          </Tooltip>
        </Space>
      ),
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
              onClick={() => handleEditOrder(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa" color="red">
            <Button
              type="primary"
              danger
              icon={<DeleteFilled />}
              onClick={() => confirmDeleteOrder(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  console.log(orders)

  return (
    <div className="flex flex-col items-start w-full">
    
      <div className="flex w-full justify-end mb-5">
        <Button
          type="primary"
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-blue-500 h-[40px] to-cyan-400 text-white font-medium rounded-full  transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg flex items-center"
        >
          <p>
            <PlusOutlined /> Thêm order mới
          </p>
        </Button>
      </div>
      <Table className="w-full" 
        columns={columns}
        dataSource={filteredOrders}
      />
      <Modal
                title={<p className='w-full text-center mb-7'>{selectedOrder? 'Chỉnh sửa order' : 'Tạo order mới'}</p>}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <OrderForm  handleCloseModal={handleCloseModal} selectedOrder={selectedOrder} form={form}/> 
            </Modal>
    </div>
  );
};

export default Admin;
