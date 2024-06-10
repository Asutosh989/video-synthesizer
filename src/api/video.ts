import axios from "axios";

const synthesiaKey = process.env.REACT_APP_SYNTHESIA_KEY;

export const getVideos = async (videoId: string) => {
  const url = `https://api.synthesia.io/v2/videos/${videoId}`;
  const headers = {
    headers: { Authorization: synthesiaKey },
  };
  const response = await axios.get(url, headers);
  return response;
};

export const createVideo = async (title: string, scriptText: string) => {
  const url = "https://api.synthesia.io/v2/videos";
  const headers = {
    headers: { Authorization: synthesiaKey },
  };
  const data = {
    test: "true",
    visibility: "private",
    title,
    input: [
      {
        avatarSettings: {
          horizontalAlign: "center",
          scale: 1,
          style: "rectangular",
          seamless: false,
        },
        backgroundSettings: {
          videoSettings: {
            shortBackgroundContentMatchMode: "freeze",
            longBackgroundContentMatchMode: "trim",
          },
        },
        scriptText,
        avatar: "anna_costume1_cameraA",
        background: "green_screen",
      },
    ],
  };

  const response = await axios.post(url, data, headers);
  return response;
};
