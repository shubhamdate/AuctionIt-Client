import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// MUI
import {
  Box,
  Paper,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
// Style files
import { boxStyle, paperStyle } from './css/adStyles';
import { profileTableStyle, tableCellStyle } from './css/dashStyle';
// Actions
import { clearAlerts } from '../actions/alert';

// Project files
import Spinner from './Spinner';
import DashboardAdList from './DashboardAdList';
import LoadingDisplay from './LoadingDisplay';
// Actions
import { getUserPurchasedAds } from '../actions/ad';
import DashPurchasedList from './DashPurchasedList';
import DashboardReviewList from './DashboardReviewList';

// Api Call
import { addReview } from '../actions/ad';

const Dashboard = (props) => {

  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (props.isAuth) {
      props.getUserPurchasedAds();
    }
  }, [props.loading]);

  useEffect(() => {
    return () => {
      props.clearAlerts();
    };
  }, []);

  useEffect(() => {
    if (props.user.ratings && props.user.ratings.length > 0) {
      let ratingArray = props.user.ratings;
      let sum = 0;
      ratingArray.forEach(x => {
        sum += x;
      });
      sum = sum / ratingArray.length;
      setRating(sum.toFixed(2))
    }
  })

  // Check if user is logged
  if (!props.isAuth) {
    navigate('/login');
  }

  return props.loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Box sx={boxStyle}>
        <Paper sx={paperStyle}>
          <Typography variant='h5'>My Profile</Typography>
          <Box sx={profileTableStyle}>
            <Table sx={{ width: '60%', minWidth: '200px' }} aria-label='simple table'>
              <TableBody>
                <TableRow key='Username'>
                  <TableCell align='right' sx={tableCellStyle}>
                    User name
                  </TableCell>
                  <TableCell align='left' sx={tableCellStyle}>
                    {props.user.username}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' sx={tableCellStyle}>
                    Email
                  </TableCell>
                  <TableCell align='left' sx={tableCellStyle}>
                    {props.user.email}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' sx={tableCellStyle}>
                    Phone
                  </TableCell>
                  <TableCell align='left' sx={tableCellStyle}>
                    {props.user.phone}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' sx={tableCellStyle}>
                    Address
                  </TableCell>
                  <TableCell align='left' sx={tableCellStyle}>
                    {props.user.address}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' sx={tableCellStyle}>
                    Rating
                  </TableCell>
                  <TableCell align='left' sx={tableCellStyle}>
                    {rating}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>

      <Box sx={boxStyle}>
        <Paper sx={paperStyle}>
          <Typography variant='h5'>My Ads</Typography>
          <DashboardAdList />
        </Paper>
      </Box>

      <Box sx={boxStyle}>
        <Paper sx={paperStyle}>
          <Typography variant='h5'>My Purchases</Typography>
          {props.purchasedLoading ? (
            <LoadingDisplay />
          ) : (
            <DashPurchasedList ads={props.purchased} />
          )}
        </Paper>
      </Box>

      <Box sx={boxStyle}>
        <Paper sx={paperStyle}>
          <Typography variant='h5'>Feedback Received</Typography>
          <DashboardReviewList />
        </Paper>
      </Box>

    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user,
  purchased: state.ad.purchased,
  purchasedLoading: state.ad.purchasedLoading,
});

export default connect(mapStateToProps, { getUserPurchasedAds, clearAlerts, addReview })(Dashboard);
