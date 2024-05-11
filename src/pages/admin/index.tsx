import Typography from '@mui/material/Typography';
import { SideBar } from '@src/libs/ui/components/Sidebar';
import { styled } from '@mui/material/styles';
import { ISideBarItem } from '@src/libs/ui/components/SidebarItem';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '@src/libs/ui';
import Paper from '@mui/material/Paper';

const SideBarItems: ISideBarItem[] = [
  {
    key: 'members',
    label: 'Users',
    icon: <PeopleAltRounded />,
  },
  {
    key: 'statistics',
    label: 'Dashboard',
    icon: <EqualizerRoundedIcon />,
  },
];

const Section = styled('section')(({ theme }) => ({
  padding: theme.spacing(3, 3, 3),
  width: '100%',
}));

const StyledPaper = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  minHeight: 'inherit',
});

export default function Admin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const key = location.pathname.split('/').pop();
  const [active, setActive] = useState(key || 'members');
  const navigate = useNavigate();
  const handleClick = (key: string) => {
    if (key === active) return;
    navigate(`/admin/${key}`);
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
            Admin
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
