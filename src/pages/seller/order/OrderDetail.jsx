import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Tag, Divider, Spin, Row, Col, Typography, Image } from 'antd';
import dayjs from 'dayjs';
import { useGetOrderDetailQuery } from '../../../services/orderApi';


const { Title, Text } = Typography;

const OrderDetail = () => {
    const { orderId } = useParams();
    const { data: orderDetail, isLoading } = useGetOrderDetailQuery(orderId)

    if (isLoading) return <Spin tip="Loading Order Details..." className="flex justify-center items-center h-screen" />;

    return (
        <div className="container mx-auto p-6 mt-[100px]">
            <Tag className='flex justify-center mb-6'><p className="font-bold text-center w-full text-4xl  my-3 bg-custom-gradient bg-clip-text text-transparent"
                style={{
                    textShadow: '2px 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                Đơn hàng: {orderId}
            </p>
            </Tag>
            <Row gutter={[16, 16]}>

                {/* Buyer Information */}
                <Col xs={24} md={12}>
                    <Card
                        title="Thông tin người đặt"
                        bordered={false}
                        className="shadow-lg hover:shadow-xl text-[19px]  transition-shadow duration-300"
                    >
                        <Text className='text-[18px]'> <strong>Name:</strong> {orderDetail?.buyerId.name}</Text><br />
                        <Text className='text-[18px]'>
                            <strong>Email:</strong>
                            <a href={`mailto:${orderDetail?.buyerId.email}`} className="text-blue-600 ml-2 hover:underline">
                                {orderDetail?.buyerId.email}
                            </a>
                        </Text><br />
                        <Text className='text-[18px]'><strong>Address:</strong> {orderDetail?.buyerId.address}</Text><br />
                        <Text className='text-[18px]'><strong>Phone Number:</strong> {orderDetail?.buyerId.phoneNumber}</Text>
                    </Card>
                </Col>

                {/* Flower Information */}
                <Col xs={24} md={12}>
                    <Card
                        title="Thông tin hoa"
                        bordered={false}
                        className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <Row>
                            <Col className='mr-[50px]'>
                                <Text className='text-[17px]'><strong>Name:</strong> {orderDetail?.flowerId.name}</Text><br />
                                <Text className='text-[17px]'><strong>Type:</strong> {orderDetail?.flowerId.type}</Text><br />
                                <Tag color='red' className='text-[17px] mt-4'><strong>Price:</strong> {orderDetail?.flowerId.price.toLocaleString()} VND</Tag>
                            </Col>
                            <Col>
                                <Image
                                    src={`http://localhost:8000/${orderDetail?.flowerId.imageUrl}`}
                                    alt={orderDetail?.flowerId.name}
                                    className="rounded-lg object-cover"
                                    width={300}
                                    height={300}
                                    placeholder
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Order Information */}
                <Col xs={24}>
                    <Card
                        title={<p>Chi tiết đơn hàng
                            <Tag className='ml-6 text-[17px]'  color={orderDetail?.status === 'Đang xử lý' ? 'blue' : orderDetail?.status === 'Hoàn thành' ? 'green' : 'red'}>
                                {orderDetail?.status}
                            </Tag>
                        </p>
                        }
                        bordered={false}
                        className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Text className=' text-[19px]'><strong>Quantity:</strong> {orderDetail?.quantity}</Text>
                            </Col>
                            <Col xs={24} md={8}>
                                <Tag color='blue'> <Text className=' text-[19px]'><strong>Total Price:</strong> {orderDetail?.totalPrice.toLocaleString()} VND</Text></Tag>
                            </Col>
                            <Col xs={24} md={8}>
                                <Text className=' text-[19px]'><strong>Order Date:</strong> {dayjs(orderDetail?.orderDate).format('DD/MM/YYYY lúc  HH:mm')}</Text>
                            </Col>
                        </Row>
                    </Card>
                </Col>

            </Row>
        </div>
    );
};

export default OrderDetail;
