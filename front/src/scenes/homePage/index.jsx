import { Box, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import APIWidget from "scenes/widgets/APIWidget";
import { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/campaigns/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
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
  }, []);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
      </Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        {
          data ? data.map((campain, index) => {
            return(
            <Box key={index} flexBasis={isNonMobileScreens ? "26%" : undefined}>
              <APIWidget campain={campain}/>
            </Box>);
          }) : <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
            <Typography>Pas de campagnes</Typography>
          </Box>
        }
      </Box>
    </Box>
  );
};

export default HomePage;