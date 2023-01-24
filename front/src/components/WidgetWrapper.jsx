import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";


const WidgetWrapper = styled(Box)(({ theme }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return ({
    width: isNonMobileScreens ? "20vw" : "80vw",
    padding: "1.5rem 1.5rem 0.75rem 1.5rem",
    backgroundColor: theme.palette.background.alt,
    borderRadius: "0.75rem",
})});

export default WidgetWrapper;