import React, { useState } from 'react';
import styled from "styled-components";
import SidebarMenu from '../Components/SidebarMenu';
import TopHeader from '../Components/TopHeader';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Container>
            <SidebarMenu sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <MainContent>
                <TopHeader toggleSidebar={toggleSidebar} />
                {children}
            </MainContent>
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f6fa;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: 0;
  transition: margin-left 0.3s;
`;

export default Layout;
