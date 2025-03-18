import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import Layout from './Layout';
import { Button, Modal, ModalBody, Form, Row, Col, FormFeedback, Input, FormGroup, Label, ModalHeader, Table, Spinner } from "reactstrap";
import { FaPlus } from "react-icons/fa";
//Flatpickr
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"

const shiftsData = {
    Monday: [{ type: "Night", time: "17:01-24:31", bgColor: "#fff" }],
    Tuesday: [{ type: "Noon", time: "16:12-24:31", bgColor: "#fff" }],
    Wednesday: [
        { type: "Split", time: "06:22-16:06", bgColor: "#fff" },
        { type: "Other", time: "13:02-23:51", bgColor: "#fff" },
    ],
    Thursday: [{ type: "Morning", time: "06:55-13:26", bgColor: "#fff" }],
    Friday: [{ type: "Split", time: "06:12-16:19", bgColor: "#fff" }],
    Saturday: [{ type: "Full Day", time: "06:55-16:15", bgColor: "#fff" }],
    Sunday: [],
};

const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Duty = () => {
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [duty_date, setDuty_date] = useState();
    const [allVehicle, setAllVehicle] = useState();

    const [dateError, setDateError] = useState();
    const [formData, setFormData] = useState({
        vehicle: '',
    });
    const [allData, setAllData] = useState();
    const api_url = 'http://localhost:3000/api';

    useEffect(() => {
        fetch_data();
        fetch_vehicle();
    }, []);
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
            console.log(err, 'customers fetching error')
        }
    };
    const fetch_data = async () => {
        try {
            setLoading(true)
            let response = await fetch(`${api_url}/crew`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const results = await response.json();
                setAllData(results.data)
                setLoading(false)
            }
        } catch (err) {
            console.log(err, 'customers fetching error')
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((pre) => ({ ...pre, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (e.target.checkValidity()) {
            try {
                let payload = { name, role }
                let response = await fetch(`${api_url}/insert_crew`, {
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

                    fetch_data();
                } else {
                    toast.error('Something went wrong!')
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            e.target.classList.add('was-validated')
            if (!duty_date) {
                setDateError('Date is required')
            }
        }

    };
    return (
        <>
            <Layout>
                <div className='d-flex justify-content-between p-3'>
                    <h4>Duty</h4>
                    <Button className='btn btn-primary' onClick={() => setModal(true)}><FaPlus />   Add New</Button>
                </div>
                <hr />
                <ScheduleContainer>
                    {allDays.map((day) => (
                        <DayColumn key={day}>
                            <Title>{day}</Title>
                            {shiftsData[day]?.length > 0 ? (
                                shiftsData[day].map((shift, index) => (
                                    <Shift key={index} bgColor={shift.bgColor}>
                                        {shift.type} <br /> {shift.time}
                                    </Shift>
                                ))
                            ) : (
                                <Shift bgColor="#bdc3c7">DAY OFF</Shift>
                            )}
                        </DayColumn>
                    ))}
                </ScheduleContainer>

                <Modal size="lg" isOpen={modal}
                    toggle={() => setModal(!modal)}>
                    <ModalHeader toggle={() => setModal(!modal)}>Add New Duty</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit} noValidate>
                            <Row>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label for="duty_date"> Date *</Label>
                                        <Input
                                            value={duty_date ? duty_date : ''}
                                            type="text" tag={Flatpickr}
                                            name="duty_date"
                                            id="duty_date" placeholder="Enter Date"
                                            options={{
                                                dateFormat: 'd-m-Y',
                                            }}
                                            onChange={(selectedDates) => {
                                                setDuty_date(selectedDates[0]);
                                                setDateError('')
                                            }}
                                            required
                                            className={`form-control ${dateError ? 'is-invalid' : ''}`}
                                        />
                                        <small className="text-danger">{dateError ? dateError : ''}</small>

                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Vehicle *</Label>
                                        <Input type="select" name="vehicle" value={formData.vehicle} onChange={handleChange} required >
                                            <option value=''>Select</option>
                                            {allVehicle?.map((data) => (
                                                <option value={data._id}>{data.name}</option>
                                            ))}
                                        </Input>

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

const ScheduleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  background-color: #f4f4f4;
  color: #333;
  min-height: 100vh;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DayColumn = styled.div`
  padding: 15px;
  border-radius: 8px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 12px;
  color: #fff;
  background: #000;
  padding: 10px;
  width:100%;
border-radius:12px;
  font-size: 18px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);

`;

const Shift = styled.div`
  padding: 10px;
  margin: 8px 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #000;
  background: ${(props) => props.bgColor || "#999"};
  width: 100%;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;  max-width: 120px;
`;

export default Duty
