import React, { useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const ReactIcon = ({
  onRouteChange,
  onSignOut,
  toggleModal,
  direction,
  ...args
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div className='pa4 tc'>
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={direction}>
        <DropdownToggle data-toggle='dropdown' tag='span'>
          <img
            src='https://tachyons.io/img/logo.jpg'
            className='br-100 ba h3 w3 dib'
            alt='avatar'
          />
        </DropdownToggle>
        <DropdownMenu
          end
          className='b--transparent shadow-5'
          style={{
            marginTop: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
          {...args}
        >
          <DropdownItem onClick={toggleModal}>View Profile</DropdownItem>
          <DropdownItem onClick={onSignOut}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ReactIcon;
