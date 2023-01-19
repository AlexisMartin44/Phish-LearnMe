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
import FormCreateGroup from 'components/FormCreateGroup';
import FormModifyGroup from "components/FormModifyGroup";


const GroupsPage = () => {
  const [name, setName] = useState('');
  const [nameModify, setNameModify] = useState('');
  const [group, setGroup] = useState('');
  const [groupModify, setGroupModify] = useState('');
  const [id, setId] = useState();
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [eventTrigger, setEventTrigger] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = () => {
    setOpen(true);
  }
  const handleOpenModify = (id) => {
    data.forEach(groupData => {
      if(groupData.id === id) {
        setId(id);
        setGroupModify(groupData.targets);
        setNameModify(groupData.name);
      }
    });
    setOpenModify(true);
  }

  const handleClose = () => {
    setOpen(false);
  }
  const handleCloseModify = () => {
    setOpenModify(false);
  }

  const handleCreateGroup = () => {
    let newGroup = JSON.stringify({
      name: name,
      targets: group,
    });
    axios.post(`${process.env.REACT_APP_GOPHISH_API}/groups/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`, newGroup, {
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
      setName("");
      setGroup([]);
      setOpen(false);
  }

  const handleModifyGroup = () => {
    let newGroup = JSON.stringify({
      id: id,
      name: nameModify,
      targets: groupModify,
    });
    axios.put(`${process.env.REACT_APP_GOPHISH_API}/groups/${id}/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`, newGroup, {
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
      setNameModify("");
      setGroupModify([]);
      setOpenModify(false);
  }

  const deleteGroup = (id) => {
    axios.delete(`${process.env.REACT_APP_GOPHISH_API}/groups/${id}/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
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
      field: 'targets',
      headerName: 'Nombre de membres',
      width: 160,
      valueFormatter: params => params?.value.length
    },
    {
      field: "action",
      width: 250,
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        const onClickOne = (e) => {
          e.stopPropagation();
          handleOpenModify(params.id);
        };
        const onClickTwo = (e) => {
          e.stopPropagation();
          deleteGroup(params.id);
        };
        return (<div><Button onClick={onClickOne}>Modifier</Button><Button color="error" onClick={onClickTwo}>Supprimer</Button></div>);
      }
    }
  ];

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/groups/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
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
        <Button sx={{ margin: 10 }} variant="contained" color="success" onClick={handleOpen}>Créer un groupe</Button>
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Créer un groupe"}
          </DialogTitle>
          <DialogContent>
            <FormCreateGroup props={{name, setName, group, setGroup}} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              Fermer
            </Button>
            <Button onClick={handleCreateGroup}>
              Créer un groupe
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={openModify}
          onClose={handleCloseModify}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Modifier le groupe"}
          </DialogTitle>
          <DialogContent>
            <FormModifyGroup props={{nameModify, setNameModify, groupModify, setGroupModify}} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModify}>
              Fermer
            </Button>
            <Button onClick={handleModifyGroup}>
              Modifier le groupe
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

export default GroupsPage;