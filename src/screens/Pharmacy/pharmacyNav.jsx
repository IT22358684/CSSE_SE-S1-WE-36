import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // For linking with React Router
import './phStyles.css';

function NavBar() {
  return (
    <div className="vertical-navbar">
      <Nav className="flex-column">
        {/* Use LinkContainer to navigate within the app without page refresh */}
        <LinkContainer to="/dashboard">
          <Nav.Link>Dashboard</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/issued-prescriptions">
          <Nav.Link>Issued Prescriptions</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/ViewInventory">
          <Nav.Link>Inventory</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/pricing">
          <Nav.Link>Medicine Pricing</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/about">
          <Nav.Link>About</Nav.Link>
        </LinkContainer>
      </Nav>
    </div>
  );
}


export default NavBar;
