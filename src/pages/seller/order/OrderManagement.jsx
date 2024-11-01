import React, { useState, useRef } from 'react';
import { Button, Table, Tag, Tooltip, message, Modal, Input } from 'antd';
import { DeleteFilled, EditFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import CreateOrder from './CreateOrder';
import { useDeleteOrderMutation, useGetAllOrderQuery } from '../../../services/orderApi';
import EditOrder from './EditOrder';

const OrderManager = () => {
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const searchInput = useRef(null);
    const [isCreateModal, setIsCreateModal] = useState(false)
    const [isEditModal, setIsEditModal] = useState(false)
    const [idForEdit, setIdForEdit] = useState(null)
    // Fetch orders using the custom API hook
    const { data: orders, error, isLoading, refetch } = useGetAllOrderQuery();
    const [deleteOrder] = useDeleteOrderMutation();


    const handleOpenCreateModal = () => {
        setIsCreateModal(true);
    }
    const handleCloseCreateModal = () => {
        setIsCreateModal(false);
    }
    const handleOpenEditModal = (id) => {
        setIsEditModal(true);
        setIdForEdit(id)
    }
    const handleCloseEditModal = () => {
        setIsEditModal(false);
        setIdForEdit(null)
    }


    const confirmDeleteOrder = (orderId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteOrder(orderId).unwrap();
                    message.success('Xóa đơn hàng thành công');
                    refetch();
                } catch (error) {
                    message.error('Xóa đơn hàng thất bại');
                }
            },
        });
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90, marginTop: 8 }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const columns = [
        {
            title: 'Tên người mua',
            dataIndex: ['buyerId', 'name'],
            key: 'buyerName',
            ...getColumnSearchProps(['buyerId', 'name']),
            render: (name, record) => (
                <Tooltip title={"Chi tiết đơn hàng"}>
                    <Link to={`/seller/order/detail/${record._id}`}>{name}</Link>
                </Tooltip>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['buyerId', 'phoneNumber'],
            key: 'phoneNumber',
        },
        {
            title: 'Tên hoa',
            dataIndex: ['flowerId', 'name'],
            key: 'flowerName',
            ...getColumnSearchProps(['flowerId', 'name']),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: 'Tổng giá',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (totalPrice) => (
                <Tag color="green">
                    {`${totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND`}
                </Tag>
            ),
            sorter: (a, b) => a.totalPrice - b.totalPrice,
        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (orderDate) => dayjs(orderDate).format('DD/MM/YYYY lúc (HH:mm)'),
            sorter: (a, b) => dayjs(a.orderDate).unix() - dayjs(b.orderDate).unix(),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Đang xử lý' ? 'blue' : status === 'Đã giao' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className='flex gap-2'>
                    <Tooltip title="Edit" color='blue'>
                        <Button
                            type='primary'
                            icon={<EditFilled />}
                            onClick={() => handleOpenEditModal(record._id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete" color='red'>
                        <Button
                            type='primary'
                            danger
                            icon={<DeleteFilled />}
                            onClick={() => confirmDeleteOrder(record._id)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex flex-col items-start w-full mt-[100px]">
            <p className="font-bold text-center w-full text-4xl mb-9 mt-3 bg-custom-gradient bg-clip-text text-transparent"
                style={{
                    textShadow: '2px 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
              Order Management
            </p>
                <div className='flex w-full justify-end mb-5'>
                    <Button type="primary" onClick={handleOpenCreateModal}
                        className="bg-gradient-to-r from-blue-500 h-[40px] to-cyan-400 text-white font-medium rounded-full  transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg">
                        <p><PlusOutlined /> Thêm mới đơn hàng</p>
                    </Button>
                </div>
                <Table
                    className="w-full min-h-[500px]"
                    columns={columns}
                    dataSource={orders?.filter(order => !order.isDeleted)}
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{
                        current: page + 1,
                        pageSize: limit,
                        total: orders?.length,
                        onChange: (pageNumber, pageSize) => {
                            setPage(pageNumber - 1);
                            setLimit(pageSize);
                        },
                    }}
                />

            </div>
            <Modal
                title="Create new order "
                open={isCreateModal}
                onCancel={handleCloseCreateModal}
                footer={null}
            >
                <CreateOrder onClose={handleCloseCreateModal} refetch={refetch} />
            </Modal>
            <Modal
                title="Edit order "
                open={isEditModal}
                onCancel={handleCloseEditModal}
                footer={null}
            >
                <EditOrder orderId={idForEdit} onClose={handleCloseEditModal} refetch={refetch} />
            </Modal>
        </>
    );
};

export default OrderManager;
