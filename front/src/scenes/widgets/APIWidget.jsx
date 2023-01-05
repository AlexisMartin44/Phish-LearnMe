import {
  Typography,
} from "@mui/material"; 
import WidgetWrapper from "components/WidgetWrapper";

const UserWidget = ({ campain }) => {
  

  return (
    <WidgetWrapper>
      <Typography>{campain.name}</Typography>
    </WidgetWrapper>
  );
};

export default UserWidget;