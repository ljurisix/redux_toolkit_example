import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const IMAGES_URL =
  "https://jsonplaceholder.typicode.com/photos?_start=4995&_limit=10";

const initialState = {
  images: [],
  status: "idle",
  error: null,
};

export const fetchImages = createAsyncThunk("images/fetchImages", async () => {
  const response = await axios.get(IMAGES_URL);
  console.log(response.data);
  return response.data;
});

export const createImage = createAsyncThunk(
  "images/createImage",
  async (initialImg) => {
    try {
      const response = await axios.post(IMAGES_URL, initialImg);
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    tagAdded(state, action) {
      const { imgId, tag } = action.payload;
      const existingImg = state.entities[imgId];
      if (existingImg) {
        existingImg.tags.concat(tag);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.status = "succeeded";
       
        state.images = state.images.concat(action.payload);
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createImage.fulfilled, (state, action) => {
        console.log(action.payload);
        // we are still inside of createSlice() so Immer handles manual changes to the state!! this is OK!
        state.images.push(action.payload);
      });
  },
});

export const selectAllImages = (state) => state.images;
export const selectImageById = (state, imgId) =>
  state.images.images.find((img) => img.id === imgId);

export const { tagAdded } = imageSlice.actions;

export default imageSlice.reducer;
