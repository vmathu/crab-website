import React from 'react';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { ISideBarItem, SideBarItem } from './SidebarItem';
import { eraseCookie } from '@src/utils/Cookie';
import { useNavigate } from 'react-router-dom';

const StyledHeader = styled('div')(({ theme }) => ({
  padding: theme.spacing(3, 2),
  borderBottom: `2px solid ${theme.palette.divider}`,
}));

const StyledSideBar = styled('div')(({ theme }) => ({
  height: '100vh',
  width: '240px',
  background: theme.palette.background.paper,
  borderRight: `2px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const StyledFooter = styled('div')(({ theme }) => ({
  padding: theme.spacing(3, 0),
  borderTop: `2px solid ${theme.palette.divider}`,
}));

interface SideBarProps {
  header?: React.ReactNode;
  active: string;
  SideBarItems: ISideBarItem[];
  onClickMenuItem: (key: string) => void;
}

export function SideBar({
  header,
  active,
  SideBarItems,
  onClickMenuItem,
}: SideBarProps) {
  const navigate = useNavigate();

  const handleLogOut = () => {
    eraseCookie('token');
    localStorage.removeItem('hasNavigated');
    navigate('/sign-in');
  };

  return (
    <StyledSideBar>
      <div>
        {Boolean(header) && <StyledHeader>{header}</StyledHeader>}
        <Stack sx={{ padding: '1.5rem 0' }} gap='0.75rem'>
          {SideBarItems.map((item) => (
            <SideBarItem
              key={item.key}
              label={item.label}
              active={item.key === active}
              icon={item.icon}
              onClick={() => onClickMenuItem(item.key)}
            />
          ))}
        </Stack>
      </div>
      <StyledFooter>
        <SideBarItem
          label='Log out'
          icon={<LogoutRoundedIcon />}
          onClick={handleLogOut}
        />
      </StyledFooter>
    </StyledSideBar>
  );
}
