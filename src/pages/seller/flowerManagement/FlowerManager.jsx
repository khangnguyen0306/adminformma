import React, { useRef, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, EyeOutlined, LockOutlined, PlusOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Image, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import clearFilter from '../../../assets/image/clear-filter.svg'
import Highlighter from 'react-highlight-words';
import { useCreateflowerMutation, useDeleteFlowerMutation, useGetAllFlowersQuery } from '../../../services/flowerApi';
import EditFlower from './EditFlower'; // Import the EditFlower component
import { Modal } from 'antd'; // Import Modal from antd
import CreateFlower from './CreateFlower'; 


const FlowerManager = () => {
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [sortedInfo, setSortedInfo] = useState({});
    const location = useLocation();
    let searchInput = null;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFlower, setSelectedFlower] = useState(null);
    const { data: flowers, error, isLoading, refetch } = useGetAllFlowersQuery();
    const [deleteFlower, { isLoading: loadingDelete }] = useDeleteFlowerMutation();


    React.useEffect(() => {
        setIsVisible(Object.keys(filteredInfo).length > 0);
    }, [filteredInfo]);

    React.useEffect(() => {
        if (location.state?.reload) {
            refetch();
        }
    }, [location, refetch]);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText('');
        handleSearch('', confirm, '')
    };

    const clearAll = (confirm) => {
        setFilteredInfo({});
        setSortedInfo({});
        setSearchText("");
        setSearchedColumn('');
        setIsVisible(false);
        setPage(0);
        refetch();
        handleSearch('', () => { }, '');
    };

    const confirmDeleteFlower = (flower) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa hoa này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteFlower(flower._id).unwrap();
                    message.success('Xóa hoa thành công');
                    refetch();
                } catch (error) {
                    message.error('Xóa hoa thất bại');
                }
            },
        });
    };


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} >
                <Input
                    ref={(node) => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
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
                    <Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
                        xóa
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };


    // Clear all filters and sorters

    const filteredFlowers = flowers?.filter(flower => !flower.isDeleted);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend'],
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            ...getColumnSearchProps('type'),
            sorter: (a, b) => a.quantity - b.quantity,
            sortOrder: sortedInfo.columnKey === 'type' && sortedInfo.order,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
            sortOrder: sortedInfo.columnKey === 'quantity' && sortedInfo.order,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <Tag color="red">
                    {`${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND`}
                </Tag>
            ),
            sorter: (a, b) => a.price - b.price,
            sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        },
        {
            title: 'Condition',
            dataIndex: 'condition',
            key: 'condition',
            sorter: (a, b) => a.condition.localeCompare(b.condition),
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl) => <img src={`http://localhost:8000/${imageUrl}`} alt="flower" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa" color='blue'>
                        <Button
                            type='primary'
                            icon={<EditFilled />}
                            onClick={() => handleEditFlower(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa" color='red'>
                        <Button
                            type='primary'
                            danger
                            icon={<DeleteFilled />}
                            onClick={() => confirmDeleteFlower(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleEditFlower = (flower) => {
        setSelectedFlower(flower._id);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedFlower(null);
    };

    const handleOpenCreateModal = () => {
        setSelectedFlower(null);
        setIsModalVisible(true);
    };

    return (
        <div className='flex flex-col items-start w-full mt-[100px]'>
            <p className="font-bold text-center w-full text-4xl mb-9 mt-3 bg-custom-gradient bg-clip-text text-transparent"
                style={{
                    textShadow: '2px 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                Flowers management
            </p>
            <div className='flex w-full justify-end mb-5'>
                <Button type="primary" onClick={handleOpenCreateModal}
                    className="bg-gradient-to-r from-blue-500 h-[40px] to-cyan-400 text-white font-medium rounded-full  transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg">
                    <p><PlusOutlined /> Thêm hoa mới</p>
                </Button>
            </div>
            {Object.keys(filteredInfo).length > 0 && (
                <Button
                    onClick={() => clearAll(searchInput, confirm)}
                    type='primary'
                    className={`mb-3 flex mb-0- items-center justify-start fade-in ${isVisible ? 'show' : ''}`}
                >
                    Bỏ lọc <Image preview={false} width={25} src={clearFilter} />
                </Button>
            )}


            <Table
                className='w-full min-h-[500px]'
                columns={columns}
                dataSource={filteredFlowers}
                rowKey="_id"
                loading={isLoading}
                onChange={handleChange}
                pagination={{
                    current: page + 1,
                    pageSize: limit,
                    total: flowers?.total,
                    onChange: (pageNumber, pageSize) => {
                        setPage(pageNumber - 1);
                        setLimit(pageSize);
                    },
                }}
            />

            <Modal
                title={<p className='w-full text-center mb-7'>{selectedFlower ? 'Chỉnh sửa hoa' : 'Tạo hoa mới'}</p>}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                {selectedFlower ? (
                    <EditFlower flower={selectedFlower} onClose={handleCloseModal} refetch={refetch} />
                ) : (
                    <CreateFlower onClose={handleCloseModal} refetch={refetch} />
                )}
            </Modal>
        </div>
    );
};

export default FlowerManager
