import styled from "styled-components";
import { FaBus, FaUser, FaTimes, } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SidebarMenu = ({ toggleSidebar, sidebarOpen }) => {

  return (
    <>
      <Sidebar className={sidebarOpen ? "open" : ""}>
        <CloseButton onClick={toggleSidebar}><FaTimes /></CloseButton>
        <Logo>Dashboard</Logo>
        <NavItem to="/duty"><FaUser /> Duty</NavItem>
        <NavItem to='/vehicle'><FaBus /> Vehicle</NavItem>
        <NavItem to='/crew'><FaUser /> Crew</NavItem>
      </Sidebar>
    </>
  )
}

const Sidebar = styled.div`
  position: fixed;
  left: -100%;
  top: 0;
  z-index:9999;
  width: 250px;
  height: 100%;
  background: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: left 0.3s;

  &.open {
    left: 0;
  }

  @media (min-width: 768px) {
    position: relative;
    left: 0;
  }
`;

const CloseButton = styled.div`
  align-self: flex-end;
  cursor: pointer;
  display: block;
  @media (min-width: 768px) {
    display: none;
  }
`;
const Logo = styled.h1`
  text-align: left;
  margin-bottom: 20px;
  font-size:23px;
`;
const NavItem = styled(NavLink)`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  justify-content: center;
color:#fff;
text-decoration:none;
  &:hover {
    background: #34495e;
  }

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;
export default SidebarMenu
