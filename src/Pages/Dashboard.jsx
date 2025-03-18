import styled from "styled-components";
import { Card, CardBody } from 'reactstrap';
import Layout from './Layout';

const Dashboard = () => {

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
            <h3>20</h3>
            <p>Vehicle</p>
          </StatCard>
          <StatCard>
            <h3>20</h3>
            <p>Crew</p>
          </StatCard>
          <StatCard>
            <h3>20</h3>
            <p>Duty</p>
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
