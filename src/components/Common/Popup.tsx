import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

interface PopupProps {
  message: string;
  open: boolean;
}

export const Popup = (props: PopupProps) => {
  const [open, setOpen] = React.useState<boolean>(props.open);

  React.useEffect(() => {
    if (open !== props.open) {
      setOpen(props.open);
    }
  }, [props]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
