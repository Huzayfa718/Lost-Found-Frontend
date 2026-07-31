import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

function ChatBox({ task, currentUser }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState("all");

  useEffect(() => {
    if (!task?._id || !currentUser?.email) return;
    setConversation(null);
    setMessages([]);
    setSelectedParticipant("all");
  }, [task?._id, currentUser?.email]);

  const loadConversation = async () => {
    if (!task?._id || !currentUser?.email) return;

    setLoading(true);
    setError("");

    try {
      const participantEmails = [currentUser.email, task.email, task.user || ""].filter(Boolean);
      const uniqueEmails = [...new Set(participantEmails)];
      const participants = uniqueEmails.map((email) => ({
        email,
        name: email === currentUser.email ? currentUser.displayName || currentUser.email : task.name || task.email,
        photoURL: email === currentUser.email ? currentUser.photoURL || "" : task.photoURL || task.image || "",
        role: email === task.email || email === task.user ? "owner" : "participant",
      }));

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations?itemId=${encodeURIComponent(task._id)}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Unable to load chat conversations");

      const data = await response.json();
      const existingConversation = (data.conversations || []).find((item) => {
        const itemId = item.itemId || "";
        return itemId === task._id || itemId === task.id;
      });

      if (existingConversation) {
        const createResponse = await fetch(`${API_BASE_URL}/chat/conversations`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemId: task._id,
            itemTitle: task.title,
            userEmail: currentUser.email,
            userName: currentUser.displayName || currentUser.email,
            ownerEmail: task.email,
            ownerName: task.name,
            participants,
          }),
        });

        if (!createResponse.ok) throw new Error("Unable to update chat conversation");
        const updated = await createResponse.json();
        setConversation(updated.conversation);
        await loadMessages(updated.conversation._id);
        return;
      }

      const createResponse = await fetch(`${API_BASE_URL}/chat/conversations`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: task._id,
          itemTitle: task.title,
          userEmail: currentUser.email,
          userName: currentUser.displayName || currentUser.email,
          ownerEmail: task.email,
          ownerName: task.name,
          participants,
        }),
      });

      if (!createResponse.ok) throw new Error("Unable to create chat conversation");
      const created = await createResponse.json();
      const newConversation = created.conversation;
      setConversation(newConversation);
      setSelectedParticipant("all");
      await loadMessages(newConversation._id);
    } catch (err) {
      console.error("Chat init failed:", err);
      setError(err.message || "Chat is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Unable to load messages");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Load messages failed:", err);
      setMessages([]);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!conversation?._id || !messageText.trim()) return;

    setLoading(true);
    try {
      const isPostOwner = (currentUser?.email || "").toLowerCase() === (task?.email || task?.user || "").toLowerCase();
      const ownerEmail = (task?.email || task?.user || "").trim();
      const recipientEmail = isPostOwner ? (selectedParticipant === "all" ? "" : selectedParticipant) : ownerEmail;
      const recipientName = isPostOwner
        ? (selectedParticipant === "all" ? "" : conversation.participants?.find((participant) => participant.email === selectedParticipant)?.name || selectedParticipant)
        : (task?.name || task?.email || task?.user || "Owner");

      const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversation._id}/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: currentUser.email,
          senderName: currentUser.displayName || currentUser.email,
          senderPhotoURL: currentUser.photoURL || "",
          recipientEmail,
          recipientName,
          text: messageText.trim(),
        }),
      });

      if (!response.ok) throw new Error("Unable to send message");
      const data = await response.json();
      setMessages(data.conversation?.messages || []);
      setMessageText("");
    } catch (err) {
      console.error("Send message failed:", err);
      setError(err.message || "Message could not be sent.");
    } finally {
      setLoading(false);
    }
  };

  const isPostOwner = (currentUser?.email || "").toLowerCase() === (task?.email || task?.user || "").toLowerCase();

  const visibleMessages = messages.filter((msg) => {
    const currentEmail = currentUser?.email?.toLowerCase();
    const senderEmail = (msg.senderEmail || "").toLowerCase();
    const recipientEmail = (msg.recipientEmail || "").toLowerCase();

    if (!isPostOwner) {
      return senderEmail === currentEmail || recipientEmail === currentEmail;
    }

    if (selectedParticipant === "all") return true;

    const selectedEmail = selectedParticipant?.toLowerCase();

    if (senderEmail === currentEmail && (recipientEmail === selectedEmail || !recipientEmail)) {
      return true;
    }

    if (senderEmail === selectedEmail && (recipientEmail === currentEmail || !recipientEmail)) {
      return true;
    }

    return false;
  });

  const fallbackParticipants = [
    {
      email: task?.email || task?.user || "",
      name: task?.name || task?.email || task?.user || "Owner",
      role: "owner",
    },
  ].filter((participant) => participant.email);

  const chatParticipants = (conversation?.participants || fallbackParticipants).filter((participant) => {
    return (participant.email || "").toLowerCase() !== currentUser?.email?.toLowerCase();
  });

  return (
    <div className="mt-6 border-t border-base-300 pt-6">
      <button
        className="btn btn-outline btn-primary w-full"
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) loadConversation();
        }}
      >
        {open ? "Hide chat" : "Open chat"}
      </button>

      {open && (
        <div className="mt-4 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
          {loading && <p className="text-sm text-slate-500">Loading chat...</p>}
          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

          {!loading && !conversation && !error && (
            <p className="text-sm text-slate-500">No conversation started yet.</p>
          )}

          {conversation && (
            <>
              <div className="mb-3 rounded-md bg-base-200 p-3 text-sm">
                {isPostOwner && (
                  <>
                    <p className="font-semibold">Conversation for: {task.title}</p>
                    <p className="text-slate-500">
                      {conversation.participants?.length > 2 ? "Group chat" : "Direct chat"}: {conversation.participants?.map((p) => p.name || p.email).join(", ")}
                    </p>
                  </>
                )}
                {isPostOwner && chatParticipants.length > 0 && (
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Choose recipient
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={selectedParticipant}
                      onChange={(event) => setSelectedParticipant(event.target.value)}
                    >
                      <option value="all">All participants</option>
                      {chatParticipants.map((participant) => (
                        <option key={participant.email} value={participant.email}>
                          {participant.name || participant.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mb-3 max-h-60 space-y-2 overflow-y-auto rounded-md bg-base-200 p-3">
                {visibleMessages.length === 0 ? (
                  <p className="text-sm text-slate-500">Start the conversation by sending a message.</p>
                ) : (
                  visibleMessages.map((msg, idx) => {
                    const senderName = msg.senderName || msg.senderEmail || "Unknown";
                    const senderEmail = (msg.senderEmail || "").toLowerCase();
                    const senderPhoto =
                      msg.senderPhotoURL ||
                      conversation?.participants?.find((participant) => (participant.email || "").toLowerCase() === senderEmail)?.photoURL ||
                      (senderEmail === (currentUser?.email || "").toLowerCase()
                        ? currentUser?.photoURL || ""
                        : senderEmail === (task?.email || task?.user || "").toLowerCase()
                          ? task?.photoURL || task?.image || ""
                          : "");
                    const avatarLetter = (senderName?.charAt(0) || "U").toUpperCase();

                    return (
                      <div key={msg._id || `${msg.senderEmail}-${idx}`} className="rounded-lg border border-base-300 bg-white p-3 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                          {senderPhoto ? (
                            <img
                              src={senderPhoto}
                              alt={senderName}
                              className="h-9 w-9 rounded-full border border-base-300 object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                                event.currentTarget.nextSibling?.classList?.remove("hidden");
                              }}
                            />
                          ) : null}
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content ${senderPhoto ? "hidden" : ""}`}>
                            {avatarLetter}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-primary">{senderName}</p>
                            <p className="text-xs text-slate-500">
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-800">{msg.text}</p>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSend} className="space-y-2">
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder="Type your message..."
                />
                <button className="btn btn-primary w-full" disabled={loading} type="submit">
                  {loading ? "Sending..." : "Send message"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatBox;
