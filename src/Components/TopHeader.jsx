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
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  text-align: center;
  margin-top: 40px;

  @media (min-width: 768px) {
    display: none;  /* Desktop view me hide karne ke liye */
  }
`;

const MenuButton = styled.div`
  position: absolute; /* fixed se absolute kiya */
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
