import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useSessionById, useJoinSession, useEndSession } from "../hooks/useSessions";
import Navbar from "../components/Navbar";
import { LoaderIcon, CrownIcon, UsersIcon, Code2Icon, XIcon } from "lucide-react";
import { getdifficultyBadgeClass } from "../lib/utils";
import toast from "react-hot-toast";

function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { data, isLoading, error } = useSessionById(id);
  const joinSessionMutation = useJoinSession(id);
  const endSessionMutation = useEndSession(id);

  const session = data?.session;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <LoaderIcon className="size-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">Session not found</p>
            <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isHost = session.host?.clerkId === user?.id;
  const isParticipant = session.participant?.clerkId === user?.id;
  const isInSession = isHost || isParticipant;
  const canJoin = !isInSession && !session.participant && session.status === "active";
  const canEnd = isHost && session.status === "active";

  const handleJoin = async () => {
    try {
      await joinSessionMutation.mutateAsync();
      toast.success("Joined session successfully!");
      // Optionally refetch session data
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEnd = async () => {
    if (window.confirm("Are you sure you want to end this session?")) {
      try {
        await endSessionMutation.mutateAsync();
        toast.success("Session ended successfully!");
        navigate("/dashboard");
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Session Header Card */}
          <div className="card bg-base-100 border-2 border-primary/20 mb-6">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative size-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Code2Icon className="size-8 text-white" />
                    {session.status === "active" && (
                      <div className="absolute -top-1 -right-1 size-5 bg-success rounded-full border-2 border-base-100" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-black mb-2">{session.problem}</h1>
                    <div className="flex items-center gap-3">
                      <span
                        className={`badge ${getdifficultyBadgeClass(session.difficulty)}`}
                      >
                        {session.difficulty.slice(0, 1).toUpperCase() +
                          session.difficulty.slice(1)}
                      </span>
                      <span
                        className={`badge ${
                          session.status === "active" ? "badge-success" : "badge-ghost"
                        }`}
                      >
                        {session.status === "active" ? "Active" : "Completed"}
                      </span>
                    </div>
                  </div>
                </div>
                {canEnd && (
                  <button
                    onClick={handleEnd}
                    disabled={endSessionMutation.isPending}
                    className="btn btn-error btn-sm gap-2"
                  >
                    <XIcon className="size-4" />
                    {endSessionMutation.isPending ? "Ending..." : "End Session"}
                  </button>
                )}
              </div>

              {/* Participants */}
              <div className="divider my-2"></div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CrownIcon className="size-5 text-warning" />
                  <span className="font-semibold">Host:</span>
                  <span>{session.host?.name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="size-5" />
                  <span className="font-semibold">Participants:</span>
                  <span>
                    {session.participant
                      ? `${session.host?.name}, ${session.participant?.name}`
                      : session.host?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {canJoin && (
            <div className="card bg-base-100 border-2 border-primary/20 mb-6">
              <div className="card-body text-center">
                <p className="mb-4">This session is open. Would you like to join?</p>
                <button
                  onClick={handleJoin}
                  disabled={joinSessionMutation.isPending}
                  className="btn btn-primary btn-lg"
                >
                  {joinSessionMutation.isPending ? (
                    <>
                      <LoaderIcon className="size-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join Session"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Session Info */}
          {isInSession && (
            <div className="card bg-base-100 border-2 border-primary/20">
              <div className="card-body">
                <h2 className="text-2xl font-bold mb-4">Session Details</h2>
                <p className="text-base-content/70 mb-4">
                  You are {isHost ? "the host" : "a participant"} of this session.
                </p>
                <p className="text-sm text-base-content/50">
                  Session ID: {session._id}
                </p>
                <p className="text-sm text-base-content/50">
                  Call ID: {session.callId}
                </p>
                {/* TODO: Add video/chat components here */}
                <div className="mt-6 p-4 bg-base-200 rounded-lg">
                  <p className="text-sm text-base-content/60">
                    Video and chat integration coming soon...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button onClick={() => navigate("/dashboard")} className="btn btn-ghost">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionPage;

