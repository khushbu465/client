
import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { Card, CardBody } from 'reactstrap';
import Layout from './Layout';

const Dashboard = () => {
  const [allVehicle, setAllVehicle] = useState();

  const [allDrivers, setAllDrivers] = useState();
  const [allconductors, setAllconductors] = useState();
  const api_url = 'http://localhost:3000/api';
  useEffect(() => {
    fetch_vehicle();
    fetchCrewData();
  }, [])
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
  // fetchCrewData
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
  return (
    <>
      <Layout >
        <Card>
          <CardBody>
            <h4>Vehicle Duty Crew Management System</h4>
          </CardBody>
        </Card>
        <Stats>
          <StatCard>
            <h3>{allVehicle?.length}</h3>
            <p>Vehicle</p>
          </StatCard>
          <StatCard>
            <h3>{allDrivers?.length}</h3>
            <p>Drivers</p>
          </StatCard>
          <StatCard>
            <h3>{allconductors?.length}</h3>
            <p>Conductor</p>
          </StatCard>
        </Stats>
      </Layout>

    </>
  )
}

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;
const StatCard = styled.div`
  background: white;
  flex: 1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;
export default Dashboard
