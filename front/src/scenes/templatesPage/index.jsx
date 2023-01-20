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
import FormCreateTemplate from 'components/FormCreateTemplate';


const TemplatesPage = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [html, setHtml] = useState("");
  const [attachments, setAttachments] = useState([]);
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
      data.forEach(template => {
        if(template.id === paramId) {
          setId(template.id);
          setName(template.name);
          setSubject(template.subject);
          setText(template.text);
          setHtml(template.html);
          setAttachments(template.attachments);
        }
      });
    }
    setOpen(true);
  }

  const handleClose = () => {
    setModifying(false);
    setName("");
    setSubject("");
    setText("");
    setHtml("");
    setAttachments([]);
    setOpen(false);
    setId(null);
  }

  const handleCreateTemplate = () => {
    if(modifying) {
      let updateGroup = JSON.stringify({
        id: id,
        name: name,
        subject : subject,
        text: text,
        html: html,
        attachments : attachments,
      });
      axios.put(`${process.env.REACT_APP_GOPHISH_API}/templates/${id}/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`, updateGroup, {
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
        subject : subject,
        text: text,
        html: html,
        attachments : attachments
      });

      axios.post(`${process.env.REACT_APP_GOPHISH_API}/templates/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`, newGroup, {
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

  const deleteTemplate = (id) => {
    axios.delete(`${process.env.REACT_APP_GOPHISH_API}/templates/${id}/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
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
          deleteTemplate(params.id);
        };
        return (<div><Button onClick={onClickOne}>Modifier</Button><Button color="error" onClick={onClickTwo}>Supprimer</Button></div>);
      }
    }
  ];

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/templates/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
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
        <Button sx={{ margin: 10 }} variant="contained" color="success" onClick={handleOpen}>Créer un template</Button>
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {modifying ? "Modifier le template" : "Créer un template"}
          </DialogTitle>
          <DialogContent>
            <FormCreateTemplate props={{name, setName, subject, setSubject, text, setText, html, setHtml, attachments, setAttachments}} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              Fermer
            </Button>
            <Button onClick={handleCreateTemplate}>
              {modifying ? "Modifier le template" : "Créer un template"}
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

export default TemplatesPage;