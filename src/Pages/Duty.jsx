import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import Layout from './Layout';
import { Button, Modal, ModalBody, Form, Row, Col, FormFeedback, Input, FormGroup, Label, ModalHeader, Table, Spinner } from "reactstrap";
import { FaPlus } from "react-icons/fa";
//Flatpickr
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import moment from "moment";
import { toast } from 'react-toastify';


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

const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];

const Duty = () => {
    const [modal, setModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [duty_date, setDuty_date] = useState();
    const [allVehicle, setAllVehicle] = useState();
    const [startTime, setStartTime] = useState(null);

    const [timeError, setTimeError] = useState();
    const [dateError, setDateError] = useState();
    const [formData, setFormData] = useState({
        vehicle: '', driver: '', conductor: '', duration: ''
    });
    const [allDuties, setAllDuties] = useState();
    const [allDrivers, setAllDrivers] = useState();
    const [allconductors, setAllconductors] = useState();
    const api_url = 'http://localhost:3000/api';

    useEffect(() => {
        fetchCrewData();
        fetch_vehicle();
        fetchDuties();
    }, []);
    //fetch Duties
    const fetchDuties = async () => {
        try {
            let response = await fetch(`${api_url}/getall`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const results = await response.json();
                setAllDuties(results.data)
            }
        } catch (err) {
            console.log(err, 'data fetching error')
        }
    };

    //fetch vehicles
    const fetch_vehicle = async () => {
        try {
            let response = await fetch(`${api_url}/vehicles`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const results = await response.json();
                setAllVehicle(results.data)
            }
        } catch (err) {
            console.log(err, 'data fetching error')
        }
    };
    //fetch drivers
    const fetchCrewData = async () => {
        try {
            let response = await fetch(`${api_url}/crew`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const results = await response.json();
                const crewData = results.data;
                const find_drivers = crewData.filter((d) => d.role === 'Driver');
                const find_conductor = crewData.filter((d) => d.role === 'Conductor');
                setAllDrivers(find_drivers);
                setAllconductors(find_conductor)
            }
        } catch (err) {
            console.log(err, 'data fetching error')
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
                let payload = {
                    date: duty_date,
                    vehicleId: formData.vehicle,
                    driverId: formData.driver,
                    conductorId: formData.conductor,
                    startTime: moment(startTime).format("HH:mm A"),
                    duration: formData.duration
                }
                let response = await fetch(`${api_url}/assign_duty`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                if (response.status === 200) {
                    const results = await response.json();
                    toast(results.message);
                    setModal(false);
                    setDuty_date('');
                    setStartTime('')
                    setFormData({
                        vehicle: '', driver: '', conductor: '', duration: ''
                    });

                } else {
                    toast.error('Something went wrong!')
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            e.target.classList.add('was-validated')
            if (!duty_date) {
                setDateError('This field is required')
            }
            if (!startTime) {
                setTimeError('This field is required')
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
                                        <p className='mb-1'><span className='text-muted'>Vehicle:</span>dfdsf </p>
                                        <p className='mb-1'><span className='text-muted'>Driver:</span> </p>
                                        <p className='mb-1'><span className='text-muted'>Conductor:</span> </p>
                                        <p className='mb-1'><span className='text-muted'>Start Time:</span> </p>
                                        <p className='mb-1'><span className='text-muted'>Duration:</span> </p>
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
                                            <option value=''>Select Vehicle</option>
                                            {allVehicle?.map((data) => (
                                                <option value={data._id}>{data.name}</option>
                                            ))}
                                        </Input>

                                        <FormFeedback>This field is required</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Driver *</Label>
                                        <Input type="select" name="driver" value={formData.driver} onChange={handleChange} required >
                                            <option value=''>Select Driver</option>
                                            {allDrivers?.map((data) => (
                                                <option value={data._id}>{data.name}</option>
                                            ))}
                                        </Input>
                                        <FormFeedback>This field is required</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Conductor *</Label>
                                        <Input type="select" name="conductor" value={formData.conductor} onChange={handleChange} required >
                                            <option value=''>Select Conductor</option>
                                            {allconductors?.map((data) => (
                                                <option value={data._id}>{data.name}</option>
                                            ))}
                                        </Input>
                                        <FormFeedback>This field is required</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Start Time *</Label>
                                        <Flatpickr
                                            value={startTime}
                                            options={{
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "h:i K",
                                                time_24hr: false,
                                            }}
                                            onChange={(selectedDates) => {
                                                setStartTime(selectedDates[0]);
                                                setTimeError('')
                                            }}
                                            placeholder="Select Time"
                                            required
                                            className={`form-control ${timeError ? 'is-invalid' : ''}`}

                                        />
                                        <small className="text-danger">{timeError ? timeError : ''}</small>
                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Duration *</Label>
                                        <Input type="number" name="duration" placeholder='Enter Duration In Hour' value={formData.duration} onChange={handleChange} required />
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
  text-align: left;
  color: #000;
  background: ${(props) => props.bgColor || "#999"};
  width: 100%;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;  max-width: 120px;
`;

export default Duty
