"use client";

import { Activity } from "botframework-directlinejs";
import AttachmentPreview from "./AttachmentPreview";
import { motion } from "framer-motion";

interface Props {
  a: Activity;
  idx: number;
  files: File[];
}

export default function RenderBubble({ a, idx, files }: Props) {
  const isUser = a.from?.role !== "bot";

  const isMsg =
    a.type === "message" && (a.text || (a.attachments && a.attachments.length));
  if (!isMsg) return null;

  const bubbleVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.99 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <motion.div
      layout
      key={a.id ?? idx}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={bubbleVariants}
      transition={{ duration: 0.18 }}
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`${
          isUser ? "bg-gradient-to-tr from-white/6 to-white/2" : "bg-white/5"
        } max-w-[80%] p-4 border rounded-2xl shadow-xs backdrop-blur-sm`}
      >
        {a.text && (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {a.text}
          </div>
        )}

        {a.attachments?.length ? (
          <div className="space-y-2">
            {a.attachments.map((att: unknown, i: number) => (
              <AttachmentPreview key={i} att={att} files={files} />
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
