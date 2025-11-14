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
      // Invalidate queries to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
      
      // Show success message
      toast.success("Session created successfully!");
      
      // Navigate to the new session
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
        // Return empty sessions array to prevent UI breakage
        return { sessions: [], error: error.message };
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    // Don't retry on 500 errors
    retryIf: (error) => error?.response?.status !== 500
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: () => sessionApi.joinSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", id] });
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      toast.success("Join session successfully !");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session !")
  })
};

export const useEndSession = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: () => sessionApi.endSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", id] });
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
      toast.success("Session ended successfully !");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to end session !")
  })
};