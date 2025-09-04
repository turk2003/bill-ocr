"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/navigator/Sidebar";
import Navbar from "@/components/navigator/Navbar";
import { ShineBorder } from "@/components/magicui/shine-border";
import {
  ChevronDownIcon,
  LinkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useDirectLine } from "@/hooks/useDirectLine";
import RenderBubble from "@/components/bubbles/RenderBubble";
import { AnimatePresence, motion } from "framer-motion";

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
  const [filesTemp, setFilesTemp] = useState<File[]>([]);
  const [saOpen, setSaOpen] = useState(true);

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
    setFilesTemp(Array.from(e.target.files || []));
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

  return (
    <div className="flex w-screen h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar status={status ? status : 0} />
        <div className="relative w-full h-[calc(100vh-77px)] flex flex-col p-3">
          <div
            ref={listRef}
            className="flex-1 max-w-4xl w-full mx-auto overflow-y-auto pt-10 pb-16"
          >
            <AnimatePresence initial={false}>
              {activities.map((a, i) => (
                <RenderBubble key={i} a={a} idx={i} files={filesTemp} />
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="w-full flex justify-start"
              >
                <div className="px-4 py-2 rounded-2xl text-sm opacity-80 ">
                  กำลังพิมพ์…
                </div>
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <div className="relative flex flex-col w-full max-w-4xl rounded-xl shadow-xl">
              {suggestedActions.length > 0 && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 bottom-full mb-2 z-50 max-w-full"
                >
                  <div className="flex justify-end mb-2">
                    <motion.button
                      onClick={() => setSaOpen((v) => !v)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97, rotate: -6 }}
                      className="p-1 rounded-md bg-white/70 backdrop-blur-sm shadow-sm border border-neutral-200"
                      title={saOpen ? "หุบ" : "ขยาย"}
                    >
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          saOpen ? "rotate-0" : "rotate-180"
                        }`}
                      />
                    </motion.button>
                  </div>
                  <AnimatePresence initial={false}>
                    {saOpen && (
                      <motion.div
                        key="suggested-actions"
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="z-50 max-h-40 overflow-auto flex flex-wrap gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow"
                      >
                        {suggestedActions.map((sa, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-3 py-1.5 text-sm rounded-lg transition border bg-white hover:bg-neutral-50 cursor-pointer shadow-lg"
                            onClick={() => sendMessage(sa.value || sa.title)}
                            title={sa.type || "postBack"}
                          >
                            {sa.title}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
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
                <motion.button
                  onClick={onSend}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95, rotate: -10 }}
                  className="px-4 py-2 cursor-pointer rounded-lg hover:bg-white/10 transition"
                  title="ส่งข้อความ"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </motion.button>
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
                <motion.button
                  className="flex items-center gap-2 cursor-pointer /90 hover: transition"
                  onClick={onPickFiles}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  title="แนบไฟล์"
                >
                  <LinkIcon className="h-5 w-5" />
                  <span>Attach</span>
                </motion.button>
              </div>
            </div>
            <span className="text-sm text-gray-400">🎉 For DEMO naja...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
