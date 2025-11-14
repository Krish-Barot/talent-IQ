import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/session.js";
import { useNavigate } from "react-router-dom";

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    retry: 0,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
      toast.success("Session created successfully!");
      if (data?.session?._id) {
        navigate(`/session/${data.session._id}`);
      }
    },
    onError: (error) => {
      console.error("Session creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create session. Please try again.");
    }
  });
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: async () => {
      try {
        const response = await sessionApi.getActiveSession();
        return response;
      } catch (error) {
        console.error("Error fetching active sessions:", error);
        return { sessions: [] }; // Return empty array on error
      }
    }
  });
};

export const useMyRecentSessions = () => {
  return useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: async () => {
      try {
        const response = await sessionApi.getMyRecentSessions();
        return response;
      } catch (error) {
        console.error("Error fetching recent sessions:", error);
        return { sessions: [] }; // Return empty array on error
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
};

export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000 // refetch every 5 seconds to detect session status changes
  });

  return result;
};

export const useJoinSession = (id) => {
  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: () => sessionApi.joinSession(id),
    onSuccess: () => toast.success("Join session successfully !"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session !")
  })
};

export const useEndSession = (id) => {
  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: () => sessionApi.endSession(id),
    onSuccess: () => toast.success("Session ended successfully !"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to end session !")
  })
};