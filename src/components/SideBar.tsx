import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { ContainerBody } from "./ContainerBody";
import { useState } from "react";
import { PAGE } from "../typings/enum";

const drawerWidth = 240;

export const SideBar = () => {
  const [activePage, updateActivePage] = useState(PAGE.generate);
  const sideBarContent = [
    {
      title: "Generate Video",
      page: PAGE.generate,
      icon: <OndemandVideoIcon />,
    },
    { title: "View Video", page: PAGE.view, icon: <RemoveRedEyeIcon /> },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Video AI
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {sideBarContent.map((content, index) => (
              <ListItem
                onClick={() => updateActivePage(content.page)}
                key={content.title}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>{content.icon}</ListItemIcon>
                  <ListItemText primary={content.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <ContainerBody activePage={activePage} />
    </Box>
  );
};
