import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

interface State extends SnackbarOrigin {
  open: boolean;
}

interface PopupProps {
  message: string;
  open: boolean;
}

export const Popup = (props: PopupProps) => {
  const [state, setState] = React.useState<State>({
    open: props.open,
    vertical: "bottom",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  React.useEffect(() => {
    console.log("Props.change", props);
    if (props.open) {
      handleClick();
    }
  }, [props]);

  const handleClick = () => () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
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
