import React from 'react'
import styled from "styled-components";
import { FaBars } from "react-icons/fa";

const TopHeader = ({ toggleSidebar }) => {
  return (
    <>
      <Header>
        <MenuButton onClick={toggleSidebar}><FaBars size={30} /></MenuButton>
      </Header>
    </>
  )
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 10px;
  flex-direction: column;
  text-align: center;
  margin-top: 40px;

  @media (min-width: 768px) {
    display: none;  
  }
`;

const MenuButton = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  cursor: pointer;
  display: block;
  z-index: 1000;

  @media (min-width: 768px) {
    display: none;
  }
`;

export default TopHeader
