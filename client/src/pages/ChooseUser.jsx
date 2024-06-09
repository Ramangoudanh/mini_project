import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { AccountCircle, School } from '@mui/icons-material';
import styled from 'styled-components';

const ChooseUser = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = React.useState(false);

  const handleNavigate = (userType) => {
    setLoader(true);
    navigate('/sign-in', { state: { userType } }); // Pass userType for conditional rendering
  };

  return (
    <StyledContainer>
      <Container>
        <CenteredGrid container spacing={6} justifyContent="center" alignItems="center">
          <Grid item>
            <StyledPaper elevation={3} onClick={() => handleNavigate('admin')}>
              <Box mb={2} display="flex" justifyContent="center" alignItems="center">
                {/* Centered admin logo */}
                <div style={{ backgroundImage: 'url("https://tse3.mm.bing.net/th?id=OIP.nhE9X7SCCvOiPk6C_YkQkwHaHa&pid=Api&P=0&h=180")', width: '80px', height: '80px', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </Box>
              <StyledTypography>Admin</StyledTypography>
              Login as an administrator to access the dashboard and manage app data.
            </StyledPaper>
          </Grid>
          <Grid item>
            <StyledPaper elevation={3} onClick={() => handleNavigate('user')}>
              <Box mb={2} display="flex" justifyContent="center" alignItems="center">
                {/* Centered user logo */}
                <div style={{ backgroundImage: 'url("https://www.iconpacks.net/icons/1/free-user-group-icon-296-thumb.png")', width: '80px', height: '80px', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </Box>
              <StyledTypography>User</StyledTypography>
              Login as a user to explore the Anonymous complaining system of the College.
            </StyledPaper>
          </Grid>
        </CenteredGrid>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(to bottom, #411d70, #19118b);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenteredGrid = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledPaper = styled(Paper)`
  padding: 40px;
  width: 350px;
  height: 300px;
  text-align: center;
  background-color: #1f1f38;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;

  &:hover {
    background-color: #2c2c6c;
    color: white;
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 10px;
`;