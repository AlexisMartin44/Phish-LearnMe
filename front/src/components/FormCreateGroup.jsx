import { Stack, TextField, Button, Grid } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

const FormCreateGroup = ({props}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState(false);

  const columns = [
    { field: 'first_name', headerName: 'Prénom', width: 100 },
    { field: 'last_name', headerName: 'Nom', width: 100 },
    { field: 'email', headerName: 'Email', width: 100 },
    { field: 'position', headerName: 'Poste', width: 100 },
    {
      field: "action",
      width: 100,
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          props.setGroup(props.group.filter(group => params.row !== group))
        };
        return <Button color="error" onClick={onClick}>Supprimer</Button>;
      }
    }
  ];

  function generateRandom() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}


  const handleAddUser = () => {
    if(!error && firstName && lastName && email && position) {
      props.setGroup((group) => ([...group, {first_name: firstName, last_name: lastName, email: email, position: position}]));
      setFirstName("");
      setLastName("");
      setEmail("");
      setPosition("");
    }
  }

  const handleChange = event => {
    setEmail(event.target.value);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      setError(true);
    } else {
      setError(false);
    }
  }

  const handleImportCsv = (event) => {
    // Récupère le fichier sélectionné
    const csvFile = event.target.files[0];

    // Vérifie que le fichier est bien un fichier CSV
    if (csvFile.type !== 'text/csv') {
        alert("Invalid file type. Please select a CSV file.");
        return;
    }

    // Utilise la fonction FileReader pour lire le contenu du fichier
    const reader = new FileReader();
    reader.readAsText(csvFile);
    reader.onload = function() {
      // Stocke le contenu du fichier dans un état
      let arr = reader.result.split(/\r?\n/);
      arr.forEach((user, index) => {
        if (index !== 0) {
          let userSplit = user.split(",");
          if(!userSplit.includes(""))
            props.setGroup((group) => ([...group, {first_name: userSplit[1], last_name: userSplit[2], email: userSplit[0], position: userSplit[3]}]));
        }
      })
    }
  }


  return (
    <Stack spacing={2} >
      <TextField
        sx={{marginTop: 2}}
        id="name"
        label="Nom du groupe"
        type="text"
        fullWidth
        value={props.name}
        onChange={e => props.setName(e.target.value)}
      />
      <Grid container>
        <Grid item={true} xs>
          <TextField
            id="firstName"
            label="Prénom"
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item={true} xs>
          <TextField
            id="lastName"
            label="Nom"
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item={true} xs>
          <TextField
            id="email"
            label="Email"
            type="text"
            value={email}
            error={error}
            onChange={handleChange}
          />
        </Grid>
        <Grid item={true} xs>
          <TextField
            id="position"
            label="Poste"
            type="text"
            value={position}
            onChange={e => setPosition(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item={true} xs>
          <label htmlFor="csv-file">
            <input
              style={{ display: "none" }}
              id="csv-file"
              name="csv-file"
              type="file"
              accept=".csv"
              onChange={handleImportCsv}
            />
            <Button color="warning" variant="outlined" component="span">
              Importer un CSV
            </Button>
          </label>
        </Grid>
        <Grid item={true} xs>
          <Button variant="outlined" color="warning" onClick={handleAddUser}>
            Ajouter
          </Button>
        </Grid>
      </Grid>
      <DataGrid
        rows={props.group}
        columns={columns}
        getRowId={() => generateRandom()}
        pageSize={5}
        autoHeight
        rowsPerPageOptions={[5]}
      />
    </Stack>
  );
};

export default FormCreateGroup;