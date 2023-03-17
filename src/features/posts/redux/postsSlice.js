import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

// base url
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

/**
 * createEntityAdapter:
 * generates prebuilt reducers and selectors for performing CRUD on a normalized state
 * https://redux-toolkit.js.org/api/createEntityAdapter
 * https://redux.js.org/usage/structuring-reducers/normalizing-state-shape
 * can get passed to createReducer and createSlice as case reducers OR as mutator functions
 */
const postAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date), // callback that returns standard array sort
});

/**
 * getInitialState:
 * automatically returns new normalized entity state object!
 * { ids: [], entities: {} }
 */
const initialState = postAdapter.getInitialState({
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  // EXAMPLE
  count: 0,
});

/**
 * createAsyncThunk(TYPE, PAYLOADCREATOR)
 * handles any delayed / async work
 *
 * TYPE:
 * string action type, used as prefix for generated action types constants for Redux
 * "posts/fetchPosts" > generates 'posts/fetchPosts/pending''posts/fetchPosts/fulfilled' or "posts/fetchPosts/rejected'
 * represents async request life cycle
 *
 * PAYLOADCREATOR(arg, thunkAPI):
 * callback function, returns promise result
 * arg: single value/object, items needed for request
 * thunkAPI: object containing all redux thunk params + options
 *
 * ALWAYS RETURNS A RESOLVED PROMISE
 */
export const fetchPosts = createAsyncThunk(
  // string action type
  "posts/fetchPosts",
  // payload creator
  async () => {
    // req information
    const response = await axios.get(POSTS_URL);
    // return promise data
    return response.data;
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  // payload creator with value
  async (initialPost) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost) => {
    // destructure id
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (err) {
      // return err.message
      // this is done because we technically arent REALLY updating the API, so we cannot edit posts we created, since they dont exist on the API
      // this is only for testing redux
      return initialPost;
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost) => {
    try {
      const response = await axios.delete(`${POSTS_URL}/${initialPost.id}`);
      // JSON placeholder does not return id of deleted post, fix just for testing
      if (response?.status === 200) return initialPost;
      return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
      return err.message;
    }
  }
);

/**
 * createSlice:
 * accepts a name, initial state, reducer functions
 * automatically generates action creators and types
 * internally uses createAction and createReducer, as well as Immer.js
 * ! IMPORTANT !
 * Immer allows "mutation" of immuable variables, so direct changes to state are possible inside of createSlice!!
 * https://immerjs.github.io/immer/
 */
const postsSlice = createSlice({
  // name
  name: "posts",
  // initial state
  initialState,
  // standard reducer logic
  // action types are automatically generated for each reducer!
  reducers: {
    // OBSOLETE:
    // used for local saving w/ no API
    // keeping for example purposes
    postAdded: {
      // actual reducer
      reducer(state, action) {
        state.entities.push(action.payload);
      },
      // format state in prepare callback
      // use to prevent repeating code in every post creation dispatch
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              heart: 0,
              lol: 0,
              what: 0,
            },
          },
        };
      },
    },
    // END OBSOLETE CODE
    // add reaction
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    // testing purposes
    increaseCount(state, action) {
      // Immer.js :)
      state.count = state.count + 1;
    },
  },
  /**
   * responses to external actions that were not defined as part of the initial slice reducers
   * slice.actions does NOT generate actions for extraReducers, this is handled by the builder
   * reducers for additional action types
   * loading state updated here
   */
  extraReducers(builder) {
    // builder: defines and handles additional case reducers that run in response to actions defined OUTSIDE of the slice
    // builder callback iis reccomended for use with TS
    builder
      // addCase: listening for status action types generated and dispatched by the corresponding thunk
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      // case: fetchPosts returns 'posts/fetchPosts/fulfilled'
      .addCase(fetchPosts.fulfilled, (state, action) => {
        // manually set state status to success
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          // manually changing minute count to display diff times since API does not return timstamp
          // adding reactions as well
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            heart: 0,
            lol: 0,
            what: 0,
          };
          return post;
        });
        // OBSOLETE: now using entityadapter
        // example for Immer
        // state.posts = state.posts.concat(loadedPosts);
        postAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        // api does not return correct id. manual increment only because of api
        action.payload.id = state.ids[state.ids.length - 1] + 1;

        // adding attributes that do not exist in the API
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          heart: 0,
          lol: 0,
          what: 0,
        };
        console.log(action.payload);
        postAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        // handling certain 'errors' (action still considered fulfilled)
        if (!action.payload?.id) {
          console.log("Update could not complete!");
          console.log(action.payload);
          return;
        }
        // const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        // OBSOLETE: filter old post out of posts array + pass new post array and edited post into state (immer)
        // const posts = state.posts.filter((post) => post.id !== id);
        // state.posts = [...posts, action.payload];
        postAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete!");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        // OBSOLETE: filter out deleted post
        // const posts = state.posts.filter((post) => post.id !== id);
        // state.posts = posts;
        postAdapter.removeOne(state, id);
      });
  },
});

// export selectors individually
// if state shape ever changes, selectors are edited ONLY here and not everywhere else in app
// export const selectAllPosts = (state) => state.posts.posts;
export const selectStatus = (state) => state.posts.status;
export const selectError = (state) => state.posts.error;
export const selectCount = (state) => state.posts.count;

// getselectors automatically creates selectors which we can rename and destructure
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postAdapter.getSelectors((state) => state.posts); // pass selector that returns post slice

/**
 * memoized selector
 * tracking and storing input & results
 * optimizes performance by only rerendering if/when dependencies change
 * https://redux.js.org/usage/deriving-data-selectors#writing-memoized-selectors-with-reselect
 * https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions
 */
export const selectPostByUser = createSelector(
  // input selectors
  [selectAllPosts, (state, userId) => userId],
  // output function
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

// export actions
// action creator is automatically generated!
export const { reactionAdded, increaseCount } = postsSlice.actions;

// export
export default postsSlice.reducer;
