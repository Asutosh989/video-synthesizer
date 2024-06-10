import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { CreateVideoResponse } from "../../typings/videos";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { getVideos } from "../../api/video";
import { Popup } from "../Common/Popup";

export const ViewVideo = () => {
  const [videoDetails, updateVideoDetails] = useState<CreateVideoResponse[]>(
    []
  );
  const [openVideoPlayer, updateOpenVideoPlayer] = useState<boolean>(false);
  const [activeUrl, updateActiveUrl] = useState<string | undefined>(undefined);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertMsg, updateAlertMessage] = useState<string>("");

  useEffect(() => {
    fetchFromLocalStorage();
  }, []);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 10,
    p: 4,
  };

  const fetchFromLocalStorage = () => {
    const videoDetails = localStorage.getItem("video");
    if (videoDetails) {
      updateVideoDetails(
        sortedVideoDetailsDataByDate(JSON.parse(videoDetails))
      );
    }
  };

  const refetchVideoDetails = (videoId: string) => {
    getVideos(videoId)
      .then((response) => {
        if (response.data.download) {
          updateStorage(videoId, response.data);
        }
      })
      .catch((err: any) => {
        if (err?.response.status === 400) {
          updateAlertMessage(err.response.data.context);
          setShowPopup(true);
        } else {
          updateAlertMessage(
            "Facing some issue fetching Video info. Please try again later"
          );
          setShowPopup(true);
        }
      });
  };

  const updateStorage = (videoId: string, data: CreateVideoResponse) => {
    let videoToBeUpdatedIndex = videoDetails.findIndex(
      (video) => video.id === videoId
    );
    let updatedVideoDetails = videoDetails;
    updatedVideoDetails[videoToBeUpdatedIndex] = data;
    updateVideoDetails(updatedVideoDetails);
    localStorage.setItem("video", JSON.stringify(updatedVideoDetails));
    fetchFromLocalStorage();
  };

  const downloadVideo = (title: string, url: string | undefined) => {
    if (!url) {
      return;
    }
    // Creating xhr as sometimes normal anchor tag download doesn't work as expected
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function () {
      const blob = new Blob([xhr.response], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    xhr.open("GET", url);
    xhr.send();
  };

  const sortedVideoDetailsDataByDate = (
    videoDetails: CreateVideoResponse[]
  ) => {
    return videoDetails.sort((a, b) => {
      const datetimeA = moment(a.createdAt);
      const datetimeB = moment(b.createdAt);
      return datetimeB.diff(datetimeA);
    });
  };

  return videoDetails.length ? (
    <Grid container spacing={3} alignItems="center">
      {videoDetails.map((video) => (
        <>
          <Grid item key={video.id}>
            <Card sx={{ width: 320 }}>
              <CardContent>
                <Typography variant="h5">{video.title}</Typography>
                <Typography variant="body1">
                  {moment.unix(video.createdAt).format("MM/DD/YYYY HH:mm:ss")}{" "}
                  <IconButton
                    aria-label="refetch"
                    onClick={() => refetchVideoDetails(video.id)}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Typography>
              </CardContent>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                  srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                  loading="lazy"
                  alt=""
                />
              </CardContent>
              <CardContent>
                {video?.download ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        endIcon={<DownloadIcon />}
                        size="medium"
                        color="primary"
                        sx={{
                          ml: "auto",
                          alignSelf: "center",
                          fontWeight: 600,
                          width: "100%",
                        }}
                        onClick={() =>
                          downloadVideo(video.title, video?.download)
                        }
                      >
                        Download
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        endIcon={<PlayArrowIcon />}
                        size="medium"
                        color="primary"
                        sx={{
                          ml: "auto",
                          alignSelf: "center",
                          fontWeight: 600,
                          width: "100%",
                        }}
                        onClick={() => {
                          updateActiveUrl(video?.download);
                          updateOpenVideoPlayer(true);
                        }}
                      >
                        Play
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body1">
                    Video generation is still under process. Please click the
                    refresh button to get the latest update
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          {openVideoPlayer && (
            <Modal
              open={openVideoPlayer}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Grid
                container
                spacing={0}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={4}>
                  <Card sx={style}>
                    <Grid
                      container
                      spacing={0}
                      justifyContent="end"
                      alignItems="end"
                    >
                      <Grid item>
                        <IconButton
                          aria-label="close"
                          onClick={() => updateOpenVideoPlayer(false)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <CardContent>
                      <video
                        id="my-player"
                        className="video-js"
                        width="100%"
                        controls
                        preload="auto"
                        data-setup="{}"
                      >
                        <source src={activeUrl} type="video/mp4"></source>
                      </video>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Modal>
          )}
        </>
      ))}
      <Popup open={showPopup} message={alertMsg} />
    </Grid>
  ) : (
    <Grid container spacing={0} justifyContent="center" alignItems="center">
      No Video
    </Grid>
  );
};
