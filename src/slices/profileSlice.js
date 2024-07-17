import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,  //trying to take user from local storage---> mila toh theek else null
      loading: false,  //were added later which were used in profile API
};

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {  //were added later when needed in profile API
            state.loading = value.payload;
          },
    },
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;