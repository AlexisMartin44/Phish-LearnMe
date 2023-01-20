import { Stack, TextField, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const FormCreateTemplate = ({props}) => {

  const columns = [
    { field: 'name', headerName: 'Nom', width: 100 },
    {
      field: "action",
      width: 100,
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          props.setAttachments(props.attachments.filter(attachment => params.row !== attachment))
        };
        return <Button color="error" onClick={onClick}>Supprimer</Button>;
      }
    }
  ];

  const handleAddFile = () => {

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
        label="Nom du template"
        type="text"
        fullWidth
        value={props.name}
        onChange={e => props.setName(e.target.value)}
      />
      <TextField
        id="subject"
        label="Sujet"
        type="text"
        value={props.subject}
        onChange={e => props.setSubject(e.target.value)}
      />
      <TextField
        id="text"
        label="Texte"
        type="text"
        multiline
        minRows={3}
        value={props.text}
        onChange={e => props.setText(e.target.value)}
      />
      <TextField
        id="html"
        label="HTML"
        type="text"
        multiline
        minRows={3}
        value={props.html}
        onChange={e => props.setHtml(e.target.value)}
      />
      <Button variant="outlined" color="warning" disabled onClick={handleAddFile}>
        Ajouter un fichier
      </Button>
      <DataGrid
        rows={props.attachments}
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