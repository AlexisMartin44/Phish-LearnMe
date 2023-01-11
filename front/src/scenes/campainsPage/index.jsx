import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Navbar from 'scenes/navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import FormCreateCampain from 'components/FormCreateCampain';

export default function CampainsPage() {
  const [template, setTemplate] = useState('');
  const [name, setName] = useState('');
  const [landingPage, setLandingPage] = useState('');
  const [url, setUrl] = useState('');
  const [group, setGroup] = useState('');
  const [sendingProfile, setSendingProfile] = useState('');
  const [data, setData] = useState(null);
  const [eventTrigger, setEventTrigger] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

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

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleCampainLaunch = () => {
    let dateSchedule = new Date().toISOString();
    let campain = JSON.stringify({
      name: name,
      template: {name: template},
      url: "http://localhost",
      page: {name: landingPage},
      smtp: {name: sendingProfile},
      launch_date: dateSchedule,
      send_by_date: null,
      groups: [{name: group}]
    });
    console.log(campain);
    axios.post(`${process.env.REACT_APP_GOPHISH_API}/campaigns/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`, campain, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        // handle success
        console.log(response.data);
        setEventTrigger(!eventTrigger);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nom', width: 130 },
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
      headerName: "Consulter la campagne",
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          navigate(`/campains/${params.id}`);
        };
        return <Button onClick={onClick}>Consulter</Button>;
      }
    },
    {
      field: "action2",
      width: 250,
      headerName: "Supprimer la campagne",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          deleteCampain(params.id);
        };
        return <Button color="error" onClick={onClick}>Supprimer</Button>;
      }
    }
  ];

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/campaigns/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        setData(response.data);
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
      <div style={{ height: 600, width: '100%', display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "space-between" }}>
        <Button sx={{ margin: 10 }} variant="contained" color="success" onClick={handleOpen} >Créer une campagne</Button>
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Nouvelle campagne"}
          </DialogTitle>
          <DialogContent>
            <FormCreateCampain props={{template, setTemplate, name, setName, landingPage, setLandingPage, url, setUrl, group, setGroup, sendingProfile, setSendingProfile}} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              Fermer
            </Button>
            <Button onClick={handleCampainLaunch}>
              Lancer la campagne
            </Button>
          </DialogActions>
        </Dialog>
        <Box sx={{ height: "100%", width: "100%" }}>
        {
          data ? <DataGrid
            rows={data ? data : null}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            components={{ Toolbar: GridToolbar }}
          /> : null
        }
        </Box>
      </div>
    </Box>
  );
}