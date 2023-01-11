import { Stack, TextField, MenuItem } from "@mui/material";
import { useState, useEffect } from 'react';
import axios from 'axios';

const FormCreateCampain = ({props}) => {
  const [dataLandingPages, setDataLandingPages] = useState([]);
  const [dataTemplates, setDataTemplates] = useState([]);
  const [dataGroups, setDataGroups] = useState([]);
  const [dataSMTP, setDataSMTP] = useState([]);

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/pages/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        setDataLandingPages(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/templates/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        setDataTemplates(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/groups/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        setDataGroups(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/smtp/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        setDataSMTP(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    }
    getData();
  }, []);

  return (
    <Stack spacing={2} >
      <TextField
        sx={{marginTop: 2}}
        id="name"
        label="Nom de la campagne"
        type="text"
        fullWidth
        value={props.name}
        onChange={e => props.setName(e.target.value)}
      />
      <TextField
        id="template"
        select
        label="Template"
        value={props.template}
        fullWidth
        onChange={event => props.setTemplate(event.target.value)}
      >
        {
          dataTemplates ? dataTemplates.map((template, index) => (
            <MenuItem key={index} value={template.name}>{template.name}</MenuItem>
          )) : <MenuItem value={10}>Ten</MenuItem>
        }
      </TextField>
      <TextField
        id="landingPage"
        select
        label="Landing Page"
        value={props.landingPage}
        fullWidth
        onChange={event => props.setLandingPage(event.target.value)}
      >
        {
          dataLandingPages ? dataLandingPages.map((landingPage, index) => (
            <MenuItem key={index} value={landingPage.name}>{landingPage.name}</MenuItem>
          )) : <MenuItem value={10}>Ten</MenuItem>
        }
      </TextField>
      <TextField
        id="url"
        label="URL"
        type="text"
        fullWidth
        value={props.url}
        onChange={e => props.setUrl(e.target.value)}
      />
      <TextField
        id="sendingProfile"
        select
        label="Profil de lancement"
        value={props.sendingProfile}
        fullWidth
        onChange={event => props.setSendingProfile(event.target.value)}
      >
        {
          dataSMTP ? dataSMTP.map((smtp, index) => (
            <MenuItem key={index} value={smtp.name}>{smtp.name}</MenuItem>
          )) : <MenuItem value={10}>Ten</MenuItem>
        }
      </TextField>
      <TextField
        id="group"
        select
        label="Groupe"
        value={props.group}
        fullWidth
        onChange={event => props.setGroup(event.target.value)}
      >
        {
          dataGroups ? dataGroups.map((group, index) => (
            <MenuItem key={index} value={group.name}>{group.name}</MenuItem>
          )) : <MenuItem value={10}>Ten</MenuItem>
        }
      </TextField>
    </Stack>
  );
};

export default FormCreateCampain;