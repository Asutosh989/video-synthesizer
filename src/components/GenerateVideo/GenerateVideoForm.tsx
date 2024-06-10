import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  FormControl,
  Card,
  CardActions,
  CardContent,
  Modal,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { createVideo } from "../../api/video";
import { CreateVideoResponse, GenerateVideoData } from "../../typings/videos";
import { useState, useEffect } from "react";
import { Popup } from "../Common/Popup";

export const GenerateVideoForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GenerateVideoData>();

  const [videoDetails, updateVideoDetails] = useState<CreateVideoResponse[]>(
    []
  );
  const [loader, setLoader] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertMsg, updateAlertMessage] = useState<string>("");

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 10,
    p: 4,
  };
  useEffect(() => {
    const videoDetails = localStorage.getItem("video");
    if (videoDetails) {
      updateVideoDetails(JSON.parse(videoDetails));
    }
  }, []);

  const onSubmit = (data: GenerateVideoData) => {
    setLoader(true);
    handleOpen();
    createVideo(data.title, data.script)
      .then((response) => {
        setLoader(false);
        const updatedVideoDetails = [...videoDetails, response.data];
        updateVideoDetails(updatedVideoDetails);
        localStorage.setItem("video", JSON.stringify(updatedVideoDetails));
      })
      .catch((err) => {
        setLoader(false);
        handleClose();
        if (err?.response.status === 400) {
          updateAlertMessage(err.response.data.context);
          setShowPopup(true);
        } else {
          updateAlertMessage(
            "Facing some issue generating Video. Please try again later"
          );
          setShowPopup(true);
        }
      });
  };

  return (
    <Grid container spacing={0} justifyContent="center" alignItems="center">
      <Grid item lg={6} md={10} sm={12} xs={12}>
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h3">Generate Video</Typography>
          </CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Box sx={{ m: 2 }}>
                <FormControl fullWidth>
                  <Controller
                    name="companyName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Company name is required",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Name"
                        helperText="Enter Company Name"
                      />
                    )}
                  />
                </FormControl>
              </Box>
              <Box sx={{ m: 2 }}>
                <FormControl fullWidth>
                  <Controller
                    name="productInfo"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Product info is required",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Product Info"
                        helperText="Say something about the product"
                      />
                    )}
                  />
                </FormControl>
              </Box>
              <Box sx={{ m: 2 }}>
                <FormControl fullWidth>
                  <Controller
                    name="targetGroupProfile"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Target Group Profile is required",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Target Group"
                        helperText="Target group may be teenagers, adult, etc."
                      />
                    )}
                  />
                </FormControl>
              </Box>
              <Box sx={{ m: 2 }}>
                <FormControl fullWidth>
                  <Controller
                    name="title"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Video Title is requried" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        label="Video Title"
                        helperText="Enter Video title"
                      />
                    )}
                  />
                </FormControl>
              </Box>
              <Box sx={{ m: 2 }}>
                <FormControl fullWidth>
                  <Controller
                    name="script"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Script is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        label="Script"
                        helperText={
                          <Typography variant="caption">
                            Enter Script for Video or can generate your script
                            for free from
                            <a
                              href="https://www.synthesia.io/features/ai-script-generator"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Synthesia AI Script Generator
                            </a>
                          </Typography>
                        }
                      />
                    )}
                  />
                </FormControl>
              </Box>
            </CardContent>
            <CardActions>
              <Box sx={{ mx: 2, px: 1, mb: 1, width: "100%" }}>
                <Button
                  sx={{ width: "100%" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Generate Video
                </Button>
              </Box>
            </CardActions>
          </form>
        </Card>
      </Grid>
      <Popup open={showPopup} message={alertMsg} />
      {openModal && (
        <Modal open={openModal} onClose={handleClose}>
          <Box sx={style}>
            {loader ? (
              <Grid
                container
                spacing={0}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <CircularProgress />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3} justifyContent="end" alignItems="end">
                <Grid item xs={12}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    The Video generation is in progress
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    To check the progress can go to <i>View Video</i> page
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    sx={{ width: "100%" }}
                    variant="outlined"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        </Modal>
      )}
    </Grid>
  );
};
