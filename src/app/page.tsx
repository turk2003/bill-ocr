"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/navigator/Sidebar";
import Navbar from "@/components/navigator/Navbar";
import { ShineBorder } from "@/components/magicui/shine-border";
import { LinkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useDirectLine } from "@/hooks/useDirectLine";
import type { Activity } from "botframework-directlinejs";

type SA = { title: string; type?: string; value?: string };

export default function Page() {
  const {
    activities,
    status,
    typing,
    sendMessage,
    sendEvent,
    sendFiles,
    myId,
  } = useDirectLine();

  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 2) {
      sendEvent("startConversation", {
        locale: "th-TH",
        roles: ["member"],
        currentURL: typeof window !== "undefined" ? window.location.href : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activities, typing]);

  const onSend = async () => {
    const text = input.trim();
    if (!text) return;
    await sendMessage(text);
    setInput("");
  };

  const onPickFiles = () => fileInputRef.current?.click();
  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      await sendFiles(files);
      e.target.value = "";
    }
  };

  const suggestedActions: SA[] = useMemo(() => {
    const lastBot = [...activities].reverse().find((a) => {
      if (a.from?.id === myId) return false;
      const sa = (a as { suggestedActions?: { actions?: SA[] } })
        .suggestedActions;
      return (
        typeof sa === "object" &&
        Array.isArray(sa?.actions) &&
        sa.actions.length > 0
      );
    });
    return (
      (lastBot as { suggestedActions?: { actions?: SA[] } })?.suggestedActions
        ?.actions ?? []
    );
  }, [activities, myId]);

  const renderBubble = (a: Activity, idx: number) => {
    const isUser = a.from?.role !== "bot";

    const isMsg =
      a.type === "message" &&
      (a.text || (a.attachments && a.attachments.length));
    if (!isMsg) return null;

    return (
      <div
        key={idx}
        className={`w-full flex ${
          isUser ? "justify-end" : "justify-start"
        } mb-2`}
      >
        <div
          className={`${
            isUser ? "" : ""
          } max-w-[80%] p-4 border rounded-2xl shadow-xs`}
        >
          {a.text && <div className="whitespace-pre-wrap">{a.text}</div>}

          {a.attachments?.length ? (
            <div className="mt-2 space-y-2">
              {a.attachments.map((att: unknown, i: number) => (
                <AttachmentPreview key={i} att={att} />
              ))}
            </div>
          ) : null}
        </div>
        {/* <span className="text-xs text-gray-500">
          {a.timestamp ? new Date(a.timestamp).toLocaleString() : ""}
        </span> */}
      </div>
    );
  };

  return (
    <div className="flex w-screen h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar status={status ? status : 0} />
        <div className="relative w-full h-[calc(100vh-77px)] flex flex-col">
          <div
            ref={listRef}
            className="flex-1 max-w-4xl w-full mx-auto overflow-y-auto py-10 "
          >
            {activities.map((a, i) => renderBubble(a, i))}

            {typing && (
              <div className="w-full flex justify-start">
                <div className="px-4 py-2 rounded-2xl text-sm opacity-80 ">
                  กำลังพิมพ์…
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-4 w-full p-3 ">
            <div className="relative flex flex-col w-full max-w-4xl rounded-xl shadow-xl">
              {suggestedActions.length > 0 && (
                <div className="right-0 -top-14 absolute flex flex-wrap gap-2 pt-2">
                  {suggestedActions.map((sa, i) => (
                    <button
                      key={i}
                      className="px-3 py-1.5 text-sm rounded-lg transition border bg-white hover:bg-neutral-50 cursor-pointer shadow-lg"
                      onClick={() => sendMessage(sa.value || sa.title)}
                      title={sa.type || "postBack"}
                    >
                      {sa.title}
                    </button>
                  ))}
                </div>
              )}
              <ShineBorder
                shineColor={[
                  "#A07CFE",
                  "#FE8FB5",
                  "#FFBE7B",
                  "#A07CFE",
                  "#FE8FB5",
                  "#FFBE7B",
                  "#A07CFE",
                  "#FE8FB5",
                  "#FFBE7B",
                ]}
                borderWidth={2}
              />
              <div className="flex items-center justify-between p-4 rounded-t-xl">
                <textarea
                  placeholder="พิมพ์ข้อความ..."
                  className="flex-1 border-none outline-none bg-transparent resize-none min-h-[48px] max-h-[120px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey
                      ? (e.preventDefault(), onSend())
                      : undefined
                  }
                />
                <button
                  onClick={onSend}
                  className="px-4 py-2 cursor-pointer rounded-lg hover:bg-white/10 transition"
                  title="ส่งข้อความ"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
              <hr />
              <div className="flex items-center p-4 rounded-b-xl">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={onFilesSelected}
                  accept="image/*,.pdf,.doc,.docx,.xlsx,.csv,.txt"
                />
                <button
                  className="flex items-center gap-2 cursor-pointer /90 hover: transition"
                  onClick={onPickFiles}
                  title="แนบไฟล์"
                >
                  <LinkIcon className="h-5 w-5" />
                  <span>Attach</span>
                </button>
              </div>
            </div>
            <span className="text-sm text-gray-400">🎉 For DEMO naja...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttachmentPreview({ att }: { att: unknown }) {
  console.log("Attachment:", att);

  const attachment = att as {
    contentType?: string;
    contentUrl?: string;
    name?: string;
  };
  const ct = (attachment.contentType || "").toLowerCase();
  if (ct.startsWith("image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={attachment.contentUrl}
        alt={attachment.name || "image"}
        className="max-w-full rounded-lg border border-white/10"
      />
    );
  }
  return (
    <a
      href={attachment.contentUrl}
      target="_blank"
      rel="noreferrer"
      className="text-sm underline break-all"
      title={attachment.name || "attachment"}
    >
      {attachment.name || attachment.contentUrl}
    </a>
  );
}
