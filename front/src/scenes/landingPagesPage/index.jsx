import Navbar from "scenes/navbar";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
import FormCreateLandingPage from 'components/FormCreateLandingPage';


const LandingPagesPage = () => {
  const [name, setName] = useState('');
  const [html, setHtml] = useState("");
  const [captureCredentials, setCaptureCredentials] = useState(false);
  const [capturePasswords, setCapturePasswords] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [eventTrigger, setEventTrigger] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [id, setId] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = (paramId) => {
    if(typeof paramId === "number") {
      setModifying(true);
      data.forEach(landingPage => {
        if(landingPage.id === paramId) {
          setId(landingPage.id);
          setName(landingPage.name);
          setHtml(landingPage.html);
          setCaptureCredentials(landingPage.capture_credentials);
          setCapturePasswords(landingPage.capture_passwords);
          setRedirectUrl(landingPage.redirect_url);
        }
      });
    }
    setOpen(true);
  }

  const handleClose = () => {
    setModifying(false);
    setName("");
    setHtml("");
    setCaptureCredentials(false);
    setCapturePasswords(false);
    setRedirectUrl("");
    setOpen(false);
    setId(null);
  }

  const handleCreateTemplate = () => {
    if(modifying) {
      let updatePage = JSON.stringify({
        id: id,
        name: name,
        html: html,
        capture_credentials : captureCredentials,
        capture_passwords: capturePasswords,
        redirect_url: redirectUrl
      });
      axios.put(`${process.env.REACT_APP_GOPHISH_API}/pages/${id}/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`, updatePage, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          // handle success
          setEventTrigger(!eventTrigger);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    } else {
      let newPage = JSON.stringify({
        name: name,
        html: html,
        capture_credentials : captureCredentials,
        capture_passwords: capturePasswords,
        redirect_url: redirectUrl
      });

      axios.post(`${process.env.REACT_APP_GOPHISH_API}/pages/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`, newPage, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          // handle success
          setEventTrigger(!eventTrigger);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }
    handleClose();
  }

  const deletePage = (id) => {
    axios.delete(`${process.env.REACT_APP_GOPHISH_API}/pages/${id}/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
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
      field: 'modified_date',
      headerName: 'Date de dernière modification',
      width: 200,
      valueFormatter: params => new Date(params?.value).toLocaleDateString('fr-FR')
    },
    {
      field: "action",
      width: 250,
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        const onClickOne = (e) => {
          e.stopPropagation();
          handleOpen(params.id);
        };
        const onClickTwo = (e) => {
          e.stopPropagation();
          deletePage(params.id);
        };
        return (<div><Button onClick={onClickOne}>Modifier</Button><Button color="error" onClick={onClickTwo}>Supprimer</Button></div>);
      }
    }
  ];

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/pages/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
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
        <Button sx={{ margin: 10 }} variant="contained" color="success" onClick={handleOpen}>Créer une Landing Page</Button>
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {modifying ? "Modifier la Landing Page" : "Créer une Landing Page"}
          </DialogTitle>
          <DialogContent>
            <FormCreateLandingPage props={{name, setName, html, setHtml, captureCredentials, setCaptureCredentials, capturePasswords, setCapturePasswords, redirectUrl, setRedirectUrl}} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              Fermer
            </Button>
            <Button onClick={handleCreateTemplate}>
              {modifying ? "Modifier la Landing Page" : "Créer une Landing Page"}
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
};

export default LandingPagesPage;