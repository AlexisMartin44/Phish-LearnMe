import { Stack, TextField, Button, Grid, Checkbox, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

const FormCreateTemplate = ({props}) => {
  const [header, setHeader] = useState("");
  const [value, setValue] = useState("");

  const columns = [
    { field: 'key', headerName: 'En-tête', width: 100 },
    { field: 'value', headerName: 'Valeur', width: 100 },
    {
      field: "action",
      width: 100,
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          props.setHeaders(props.headers.filter(header => params.row !== header))
        };
        return <Button color="error" onClick={onClick}>Supprimer</Button>;
      }
    }
  ];

  const handleCheck = (event) => {
    props.setIgnoreCert(event.target.checked);
  }

  const handleAddHeader = () => {
    if(header && value) {
      props.setHeaders((previous) => ([...previous, {key: header, value: value}]));
      setHeader("");
      setValue("");
    }
  }

  function generateRandom() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  return (
    <Stack spacing={2} >
      <TextField
        sx={{marginTop: 2}}
        id="name"
        label="Nom du profil"
        type="text"
        fullWidth
        value={props.name}
        onChange={e => props.setName(e.target.value)}
      />
      <TextField
        id="smtpFrom"
        label="Email de provenance"
        type="text"
        value={props.emailFrom}
        onChange={e => props.setEmailFrom(e.target.value)}
      />
      <TextField
        id="host"
        label="Hébergement"
        type="text"
        value={props.host}
        onChange={e => props.setHost(e.target.value)}
      />
      <TextField
        id="username"
        label="Utilisateur"
        type="text"
        value={props.username}
        onChange={e => props.setUsername(e.target.value)}
      />
      <TextField
        id="password"
        label="Mot de passe"
        type="password"
        value={props.password}
        onChange={e => props.setPassword(e.target.value)}
      />
      <Grid container justifyContent="space-between" alignItems="center" rowSpacing={1}>
        <Grid item xs={2}>
          <Checkbox
            checked={props.ignoreCert}
            onChange={handleCheck}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
        <Grid item xs={10}>
          <Typography>Ignorer l'erreur de certificat</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            id="header"
            label="En-tête"
            type="text"
            value={header}
            onChange={e => setHeader(e.target.value)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            id="value"
            label="Valeur"
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </Grid>
        <Grid item xs>
          <Button variant="outlined" color="warning" onClick={handleAddHeader}>
            Ajouter
          </Button>
        </Grid>
      </Grid>
      <DataGrid
        rows={props.headers}
        columns={columns}
        getRowId={() => generateRandom()}
        pageSize={5}
        autoHeight
        rowsPerPageOptions={[5]}
      />
    </Stack>
  );
};

export default FormCreateTemplate;