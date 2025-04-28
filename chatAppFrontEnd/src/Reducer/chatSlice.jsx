import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
// import { Navigate } from "react-router";

const initialState = {
  user: localStorage.getItem("chatAppUserDetail"),
  token: localStorage.getItem("chatAppToken"),
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/public/login`,
        user
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);

export const sendEmail = createAsyncThunk(
  "email/send",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/email/send`,
        email
      );
      return response.status;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);
export const createUser = createAsyncThunk(
  "create/user",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/public/Signup`,
        user
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);

export const changePassword = createAsyncThunk(
  "change/password",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/public/change-pass`,
        user
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);
export const findUser = createAsyncThunk(
  "user/find",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/public/findUser`,
        formData.userName,
        { headers: { "Content-Type": "text/plain" } }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);
export const getUserDetail = createAsyncThunk(
  "user/getDetail",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      if (!token) {
        console.error("Token is missing or invalid");
      }
      const response = await axios.get(
        "http://localhost:8080/user/fetchUserDetail",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the data if the request is successful
    } catch (e) {
      if (e.response) {
        // Handle specific error responses from the server
        return rejectWithValue(e.response.data);
      }
      // Handle network or other unexpected errors
      return rejectWithValue("Unexpected error");
    }
  }
);

export const setProfileImg = createAsyncThunk(
  "user/setImg",
  async (ImageData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.post(
        "http://localhost:8080/user/user-img",
        ImageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        // Handle specific error responses from the server
        return rejectWithValue(e.response.data);
      }
      // Handle network or other unexpected errors
      return rejectWithValue("Unexpected error");
    }
  }
);
// Ai----------------------------------
export const ChatAi = createAsyncThunk(
  "ai/ask",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.post(
        "http://localhost:8080/api/qna/ask",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const deleteProfileImg = createAsyncThunk(
  "user/deleteImg",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.delete("http://localhost:8080/user/delete-img", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const setGroupImg = createAsyncThunk(
  "room/setImg",
  async ({ ImageData, groupId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.post(
        `http://localhost:8080/chatroom/group-img/${groupId}`,
        ImageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const deleteGroupImg = createAsyncThunk(
  "group/deleteImg",
  async (roomKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.delete(
        `http://localhost:8080/chatroom/delete-img/${roomKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const updateUser = createAsyncThunk(
  "user/update",
  async (user, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.put("http://localhost:8080/user", user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const updateGroup = createAsyncThunk(
  "chatRoom/update",
  async (chatRoom, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = await axios.put(
        "http://localhost:8080/chatroom/update-room",
        chatRoom,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const createRoom = createAsyncThunk(
  "room/create",
  async (chatRoom, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.post(
        "http://localhost:8080/chatroom/create",
        chatRoom,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return (await response).data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const joinRoom = createAsyncThunk(
  "room/join",
  async (roomKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.post(
        "http://localhost:8080/chatroom/join-group",
        roomKey,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
        }
      );
      return (await response).data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
export const leaveGroup = createAsyncThunk(
  "room/leave",
  async (roomKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.post(
        "http://localhost:8080/chatroom/leave-group",
        roomKey,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
        }
      );
      return (await response).data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "room/delete",
  async (roomKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("chatAppToken");
      const response = axios.delete(
        `http://localhost:8080/chatroom/delete/${roomKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const chatSlice = createSlice({
  name: "chatApp",
  initialState,
  reducers: {
    addMessageToGroup: (state, action) => {
  const { roomId, message } = action.payload;

  state.user.group = state.user.group.map((group) => {
    if (group.roomKey === roomId) {
      return {
        ...group,
        chat: [...group.chat, message],
      };
    }
    return group;
  });
},

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        localStorage.setItem("chatAppToken", action.payload);
        toast.success("login-sucessful");
      })
      .addCase(loginUser.rejected, (state, action) => {
        toast.error(action.payload || "Login failed. please try again.");
      })
      .addCase(sendEmail.fulfilled, (state) => {
        toast.success("Email Sent");
      })
      .addCase(sendEmail.rejected, (state) => {
        toast.error(action.payload || "Failed to send email");
      })
      .addCase(createUser.fulfilled, (state, action) => {
        toast.success("User created sucessfully");
      })
      .addCase(createUser.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        toast.success("User created sucessfully");
      })
      .addCase(changePassword.rejected, (state, action) => {
        toast.error(action.payload || "Error in changing password");
      })
      .addCase(findUser.fulfilled, (state, action) => {
        state.user = action.payload;
        // toast.success("User Found");
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("chatAppUserDetail", action.payload);
      })
      .addCase(getUserDetail.rejected, () => {
        localStorage.removeItem("chatAppToken");
        localStorage.removeItem("chatAppUserDetail");
        localStorage.removeItem("boxSizes");
        window.location.reload();
      })
      .addCase(setProfileImg.fulfilled, (state, action) => {
        state.user.userImageUrl = action.payload;
        toast.success("Profile Image Changed");
      })
      .addCase(deleteProfileImg.fulfilled, (state) => {
        state.user.userImageUrl = null;
        toast.success("Profile Image removed");
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        toast.success("user updated");
      })
      .addCase(updateUser.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(ChatAi.fulfilled, (state, action) => {
        const question = action.meta.arg.question;
        const ans = action.payload;

        state.user.aiQna[question] = ans;
        toast.success("ai requese");
      })
      .addCase(ChatAi.rejected, (state, action) => {
        toast.error(action.payload || "Error in changing password");
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(joinRoom.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        const roomKey = action.meta.arg;
        const groupIndex = state.user.group.findIndex((id) => id === roomKey);
        if (groupIndex !== -1) {
          state.user.group.splice(groupIndex, 1);
        }
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        const roomKey = action.meta.arg;
        const groupIndex = state.user.group.findIndex((id) => id === roomKey);
        if (groupIndex !== -1) {
          state.user.group.splice(groupIndex, 1);
        }
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(deleteGroupImg.fulfilled, (state, action) => {
        const roomKey = action.meta.arg;
        state.user.group.find((g) => g.roomKey === roomKey).groupImageUrl = "";
      })
      .addCase(deleteGroupImg.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(setGroupImg.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      })
      .addCase(setGroupImg.fulfilled, (state, action) => {
        const roomKey = action.meta.arg.groupId;
        const group = state.user.group.find((g) => g.roomKey === roomKey);
        if (group) {
          group.groupImageUrl = action.payload;
          toast.success("Image Changed");
        }
      })

      .addCase(updateGroup.fulfilled, (state, action) => {
        state.user = action.payload;
        toast.success("group updated");
      })
      .addCase(updateGroup.rejected, (state, action) => {
        toast.error(action.payload || "Error in creating user");
      });
  },
});

export default chatSlice.reducer;
export const { addMessageToGroup } = chatSlice.actions;