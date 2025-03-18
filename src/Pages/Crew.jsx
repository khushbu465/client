import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import Layout from './Layout';
import { Card as ReactstrapCard, CardBody, Button, Modal, ModalBody, Form, Row, Col, FormFeedback, Input, FormGroup, Label, ModalHeader, Table, Spinner } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import { toast } from 'react-toastify';

const Crew = () => {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState();
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState();
  const api_url = 'http://localhost:3000/api';

  useEffect(() => {
    fetch_data();
  }, [])
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
          setName('')
          setRole('')
          fetch_data();
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
                <h4>Crew</h4>
                <Button className='btn btn-primary' onClick={() => setModal(true)}><FaPlus />   Add New</Button>
              </div>
              <div className="table_here table-responsive mt-4">
                <Table className='bordered table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th className='bg-dark text-light'>Sr. No.</th>
                      <th className='bg-dark text-light'>Name</th>
                      <th className='bg-dark text-light'>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ?
                      <>
                        <Spinner />
                      </>
                      : allData && allData.length > 0 ?
                        allData?.map((data, id) => (
                          <tr>
                            <td>{id + 1}</td>
                            <td>{data.name}</td>
                            <td>{data.role}</td>
                          </tr>
                        )) : <h3>Data not available</h3>}
                  </tbody>
                </Table>

              </div>
            </CardBody>
          </StyledCard>
        </div>
        <Modal size="md" isOpen={modal}
          toggle={() => setModal(!modal)}>
          <ModalHeader toggle={() => setModal(!modal)}>Add New crew member</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit} noValidate>
              <Row>
                <Col lg={12} md={12} >
                  <FormGroup>
                    <Label>Name *</Label>
                    <Input type="text" name="vehicle" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" required />
                    <FormFeedback>This field is required</FormFeedback>
                  </FormGroup>
                </Col>
                <Col lg={12} md={12} >
                  <FormGroup>
                    <Label>Role *</Label>
                    <Input type="text" name="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Enter Role" required />
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
export default Crew
