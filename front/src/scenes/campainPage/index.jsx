import Navbar from 'scenes/navbar';
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import ProgressCircle from 'components/ProgressCircle';

export default function CampainPage() {
  const [data, setData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/campaigns/${location.state.id}/results/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    }
    getData();
  });

  return (
    <Box>
      <Navbar />
      <Typography>{data}</Typography>
      <ProgressCircle size="125" />
    </Box>
  );
}