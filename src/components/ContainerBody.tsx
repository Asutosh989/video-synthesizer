import { Box, Toolbar } from "@mui/material";
import { ViewVideo } from "./ViewVideo/ViewVideo";
import { PAGE } from "../typings/enum";
import { GenerateVideoForm } from "./GenerateVideo/GenerateVideoForm";

export const ContainerBody = (props: {activePage: string}) => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      {props.activePage === PAGE.generate && <GenerateVideoForm />}
      {props.activePage === PAGE.view && <ViewVideo />}
    </Box>
  );
};