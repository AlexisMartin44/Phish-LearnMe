import { Box, useMediaQuery, Button, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import HomeCharts from 'components/HomeCharts';

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [eventTrigger, setEventTrigger] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nom', width: 200 },
    {
      field: 'created_date',
      headerName: 'Date de création',
      width: 200,
      valueFormatter: params => new Date(params?.value).toLocaleDateString('fr-FR')
    },
    { field: 'status', headerName: 'Statut', width: 160 },
    {
      field: "action",
      width: 250,
      headerName: "Actions",
      renderCell: (params) => {
        const onClickOne = (e) => {
          e.stopPropagation();
          navigate(`/campains/${params.id}`, {state:{id: params.id}});
        };
        const onClickTwo = (e) => {
          e.stopPropagation();
          deleteCampain(params.id);
        };
        return (<div><Button onClick={onClickOne}>Consulter</Button><Button color="error" onClick={onClickTwo}>Supprimer</Button></div>);
      }
    },
  ];

  const deleteCampain = (id) => {
    axios.delete(`${process.env.REACT_APP_GOPHISH_API}/campaigns/${id}/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        setEventTrigger(!eventTrigger);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  }

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/campaigns/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        setData(response.data.slice(-3));
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    }
    getData();
  }, [eventTrigger]);

  return (
    <Box>
      <Navbar />
      <Stack sx={{marginTop: 10}} spacing={2}  direction={{ xs: 'column', sm: 'row' }}  alignItems="center">
        <Box
          padding="2rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="0.5rem"
          justifyContent="space-between"
        >
          <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
            <UserWidget userId={_id} picturePath={picturePath} />
          </Box>
        </Box>
        <Box sx={{ width: "80%", paddingRight: isNonMobileScreens ? "10vw" : 0 }}>
        {
          data ? <DataGrid
            autoHeight
            rows={data ? data : null}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          /> : null
        }
        </Box>
      </Stack>
      <HomeCharts props={{eventTrigger}} />
    </Box>
  );
};

export default HomePage;