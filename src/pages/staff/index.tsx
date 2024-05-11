import {
  // useTheme,
  // useMediaQuery,
  Typography,
} from '@mui/material';
import { SideBar } from '@src/libs/ui/components/Sidebar';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '@src/libs/ui';
import { ISideBarItem } from '@src/libs/ui/components/SidebarItem';
import AddIcCallRoundedIcon from '@mui/icons-material/AddIcCallRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { useState } from 'react';
import Paper from '@mui/material/Paper';

const Section = styled('section')(({ theme }) => ({
  padding: theme.spacing(3, 3, 3),
  width: '100%',
}));

const SideBarItems: ISideBarItem[] = [
  {
    key: 'new-booking',
    label: 'New Booking',
    icon: <AddIcCallRoundedIcon />,
  },
  {
    key: 'resolve-gps',
    label: 'Resolve GPS',
    icon: <LocationOnRoundedIcon />,
  },
];

const StyledPaper = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  minHeight: 'inherit',
});

export default function Staff({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const key = location.pathname.split('/').pop();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [active, setActive] = useState(key || 'new-booking');

  const handleClick = (key: string) => {
    if (key === active) return;
    navigate(`/staff/${key}`);
    setActive(key);
  };

  return (
    <>
      <SideBar
        header={
          <Typography
            variant='subtitle1'
            textTransform='uppercase'
            fontWeight='bold'
            sx={{
              color: colors.green900,
            }}
          >
            Staff Workspace
          </Typography>
        }
        active={active}
        SideBarItems={SideBarItems}
        onClickMenuItem={handleClick}
      />
      <Section>
        <StyledPaper variant='section'>{children}</StyledPaper>
      </Section>
    </>
  );
}
