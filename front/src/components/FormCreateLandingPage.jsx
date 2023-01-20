import { Stack, TextField, Button, Grid, Checkbox, Typography } from "@mui/material";

const FormCreateLandingPage = ({props}) => {

  const handleImportSite = () => {

  }

  return (
    <Stack spacing={2} >
      <TextField
        sx={{marginTop: 2}}
        id="name"
        label="Nom de la Landing Page"
        type="text"
        fullWidth
        value={props.name}
        onChange={e => props.setName(e.target.value)}
      />
      <Button variant="outlined" color="warning" disabled onClick={handleImportSite}>
        Importer un site
      </Button>
      <TextField
        id="html"
        label="HTML"
        type="text"
        multiline
        minRows={3}
        value={props.html}
        onChange={e => props.setHtml(e.target.value)}
      />
      {props.captureCredentials ? <div>
        <Grid container justifyContent="space-between" alignItems="center" rowSpacing={1}>
          <Grid item xs={2}>
            <Checkbox
              checked={props.captureCredentials}
              onChange={(e) => {props.setCaptureCredentials(e.target.checked)}}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          <Grid item xs={10}>
            <Typography>Capturer les données soumises</Typography>
          </Grid>
          <Grid item xs={2}>
            <Checkbox
              checked={props.capturePasswords}
              onChange={(e) => {props.setCapturePasswords(e.target.checked)}}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          <Grid item xs={10}>
            <Typography>Capturer les mots de passes</Typography>
          </Grid>
        </Grid>
        <TextField
          sx={{marginTop: 2}}
          id="redirectUrl"
          label="Rediriger vers..."
          type="text"
          fullWidth
          value={props.redirectUrl}
          onChange={e => props.setRedirectUrl(e.target.value)}
        />
      </div> : <Grid container justifyContent="space-between" alignItems="center" rowSpacing={1}>
          <Grid item xs={2}>
            <Checkbox
              checked={props.captureCredentials}
              onChange={(e) => {props.setCaptureCredentials(e.target.checked)}}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          <Grid item xs={10}>
            <Typography>Capturer les données soumises</Typography>
          </Grid>
        </Grid>}
    </Stack>
  );
};

export default FormCreateLandingPage;