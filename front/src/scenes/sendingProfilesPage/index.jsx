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
import FormCreateSendingProfile from 'components/FormCreateSendingProfile';


const SendingProfilesPage = () => {
  const [name, setName] = useState('');
  const [headers, setHeaders] = useState([]);
  const [emailFrom, setEmailFrom] = useState("");
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ignoreCert, setIgnoreCert] = useState(true);
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
      data.forEach(sendingProfile => {
        if(sendingProfile.id === paramId) {
          setId(sendingProfile.id);
          setName(sendingProfile.name);
          setUsername(sendingProfile.username);
          setPassword(sendingProfile.password);
          setHost(sendingProfile.host);
          setIgnoreCert(sendingProfile.ignore_cert_errors);
          setHeaders(sendingProfile.headers);
          setEmailFrom(sendingProfile.from_address);
        }
      });
    }
    setOpen(true);
  }

  const handleClose = () => {
    setModifying(false);
    setName("");
    setEmailFrom("");
    setHost("");
    setUsername("");
    setPassword("");
    setIgnoreCert(true);
    setHeaders([]);
    setOpen(false);
    setId(null);
  }

  const handleCreateSendingProfile = () => {
    if(modifying) {
      let updateGroup = JSON.stringify({
        id: id,
        name: name,
        from_address : emailFrom,
        interface_type: "SMTP",
        host: host,
        username : username,
        password : password,
        ignore_cert_errors : ignoreCert,
        headers : headers
      });
      axios.put(`${process.env.REACT_APP_GOPHISH_API}/smtp/${id}/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`, updateGroup, {
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
      let newGroup = JSON.stringify({
        name: name,
        from_address : emailFrom,
        interface_type: "SMTP",
        host: host,
        username : username,
        password : password,
        ignore_cert_errors : ignoreCert,
        headers : headers
      });

      axios.post(`${process.env.REACT_APP_GOPHISH_API}/smtp/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`, newGroup, {
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

  const deleteSendingProfile = (id) => {
    axios.delete(`${process.env.REACT_APP_GOPHISH_API}/smtp/${id}/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
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
    { field: 'interface_type', headerName: 'Type d\'interface', width: 130 },
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
          deleteSendingProfile(params.id);
        };
        return (<div><Button onClick={onClickOne}>Modifier</Button><Button color="error" onClick={onClickTwo}>Supprimer</Button></div>);
      }
    }
  ];

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/smtp/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
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
        <Button sx={{ margin: 10 }} variant="contained" color="success" onClick={handleOpen}>Créer un profil d'envoi</Button>
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {modifying ? "Modifier le profil d'envoi" : "Créer un profil d'envoi"}
          </DialogTitle>
          <DialogContent>
            <FormCreateSendingProfile props={{name, setName, headers, setHeaders, emailFrom, setEmailFrom, host, setHost, username, setUsername, password, setPassword, ignoreCert, setIgnoreCert}} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              Fermer
            </Button>
            <Button onClick={handleCreateSendingProfile}>
              {modifying ? "Modifier le profil" : "Créer un profil d'envoi"}
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

export default SendingProfilesPage;