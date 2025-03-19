import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import Layout from './Layout';
import { Card as ReactstrapCard, CardBody, Button, Modal, ModalBody, Form, Row, Col, FormFeedback, Input, FormGroup, Label, ModalHeader, Table, Spinner } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import { toast } from 'react-toastify';

const Vehicle = () => {
    const [modal, setModal] = useState(false);
    const [name, setName] = useState();
    const [loading, setLoading] = useState(false);
    const [allVehicle, setAllVehicle] = useState();
    const api_url = 'http://localhost:3000/api';

    useEffect(() => {
        fetch_vehicle();
    }, [])
    const fetch_vehicle = async () => {
        try {
            setLoading(true)
            let response = await fetch(`${api_url}/vehicles`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const results = await response.json();
                setAllVehicle(results.data)
                setLoading(false)
            }
        } catch (err) {
            console.log(err, 'data fetching error')
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (e.target.checkValidity()) {
            try {
                let payload = { name }
                let response = await fetch(`${api_url}/insert_vehicle`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                if (response.status === 200) {
                    const results = await response.json();
                    toast.success(results.message);
                    setModal(false);
                    setName('')
                    fetch_vehicle();
                } else {
                    toast.error('Something went wrong!')
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            e.target.classList.add('was-validated')
        }

    };
    return (
        <>
            <Layout>
                <div className='pt-3'>
                    <StyledCard>
                        <CardBody>
                            <div className='d-flex justify-content-between'>
                                <h4>Vehicle</h4>
                                <Button className='btn btn-primary' onClick={() => setModal(true)}><FaPlus />   Add New</Button>
                            </div>
                            <div className="table_here table-responsive mt-4">
                                {loading ?
                                    <>
                                        <Row className='w-100'>
                                            <Col className='p-5 text-center'>
                                                <Spinner />
                                            </Col>
                                        </Row>
                                    </>
                                    : allVehicle && allVehicle.length > 0 ?
                                        <Table className='bordered table-bordered table-hover'>
                                            <thead>
                                                <tr>
                                                    <th className='bg-dark text-light'>Sr. No.</th>
                                                    <th className='bg-dark text-light'>Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allVehicle?.map((data, id) => (
                                                    <tr key={id}>
                                                        <td>{id + 1}</td>
                                                        <td>{data.name}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                        : <h3>Data not available</h3>
                                }
                            </div>
                        </CardBody>
                    </StyledCard>
                </div>
                <Modal size="md" isOpen={modal}
                    toggle={() => setModal(!modal)}>
                    <ModalHeader toggle={() => setModal(!modal)}>Add New Vehicle</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit} noValidate>
                            <Row>
                                <Col lg={12} md={12} >
                                    <FormGroup>
                                        <Label>Name *</Label>
                                        <Input type="text" name="vehicle" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Vehicle Name" required />
                                        <FormFeedback>This field is required</FormFeedback>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <br />
                            <FormGroup className="text-center">
                                <Button type="submit" color="primary">Submit</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </Layout>

        </>
    )
}

const StyledCard = styled(ReactstrapCard)`
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: none;
`;

export default Vehicle
