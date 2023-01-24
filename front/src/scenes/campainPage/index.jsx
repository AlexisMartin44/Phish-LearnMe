import Navbar from 'scenes/navbar';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  Typography,
  Card,
  CardContent,
  Stack
}
  from "@mui/material";
import {
  RocketLaunch,
  Drafts,
  HighlightAlt,
  Backup,
  EmojiFlags,
  DeleteForever,
  Refresh
} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import CampainCharts from 'components/CampainCharts';

export default function CampainPage() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectUser, setSelectUser] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dark = theme.palette.neutral.dark;

  const handleClose = () => {
    setOpen(false);
  }
  
  const returnIcon = (param) => {
    switch (param) {
      case "Email Sent":
        return <RocketLaunch sx={{ color: dark, fontSize: "25px", marginRight: 5, marginLeft: 2 }} />;
      case "Email Opened":
        return <Drafts sx={{ color: dark, fontSize: "25px", marginRight: 5, marginLeft: 2 }} />;
      case "Clicked Link":
        return <HighlightAlt sx={{ color: dark, fontSize: "25px", marginRight: 5, marginLeft: 2 }} />;
      case "Submitted Data":
        return <Backup sx={{ color: dark, fontSize: "25px", marginRight: 5, marginLeft: 2 }} />;
      default:
        break;
    }
  }

  const translate = (param) => {
    switch (param) {
      case "Email Sent":
        return "Email envoyé";
      case "Email Opened":
        return "Email ouvert";
      case "Clicked Link":
        return "Lien cliqué";
      case "Submitted Data":
        return "Données soumises";
      default:
        break;
    }
  }

  const columns = [
    { field: 'first_name', headerName: 'Prénom', width: 130 },
    { field: 'last_name', headerName: 'Nom', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
    { field: 'position', headerName: 'Poste', width: 130 },
    {
      field: 'status',
      headerName: 'Statut',
      width: 130,
      valueFormatter: params => {
        return translate(params.value);
      }
    },
    {
      field: "action",
      width: 250,
      headerName: "Timeline",
      renderCell: (params) => {
        const onClickOne = (e) => {
          e.stopPropagation();
          setSelectUser(params.row);
          setOpen(true);
        };
        return (<Button onClick={onClickOne}>Consulter</Button>);
      }
    },
  ];

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/campaigns/${location.state.id}/results/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
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
  }, [location.state.id]);

  return (
    <Box>
      <Navbar />
      <Stack sx={{marginTop: 4}} direction="row" justifyContent="center">
        <Button sx={{marginRight: 2}} variant="contained"><EmojiFlags sx={{marginRight: 2}} /> Terminer</Button>
        <Button variant="contained"><DeleteForever sx={{marginRight: 2}} /> Supprimer</Button>
        <Button sx={{marginLeft: 2}} variant="contained"><Refresh sx={{marginRight: 2}} /> Rafraîchir</Button>
      </Stack>
      <CampainCharts />
      {
        data.results ? <DataGrid
            sx={{marginTop: 10}}
            rows={data.results ? data.results : null}
            columns={columns}
            pageSize={5}
            autoHeight
            rowsPerPageOptions={[5]}
            components={{ Toolbar: GridToolbar }}
          /> : null
      }
      <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Timeline - {selectUser ? selectUser.email : null}
          </DialogTitle>
          <DialogContent>
          {
            data.timeline ? data.timeline.map((event, index) => {
              if (event.email === selectUser?.email) {
                return (<Card key={index} sx={{ minWidth: 275, marginTop: 3 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center">
                      { returnIcon(event.message) }
                      <Box>
                        <Typography variant="h5" component="div">
                          {translate(event.message)}
                        </Typography>
                        <Typography variant="body2" sx={{marginTop: 3}}>
                          {new Date(event.time).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>);
              } else {
                return null;
              }
            }) : null
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}