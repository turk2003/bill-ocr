"use client";

import { motion } from "framer-motion";

interface Props {
  att: unknown;
}

export default function AttachmentPreview({ att }: Props) {
  const attachment = att as {
    contentType?: string;
    contentUrl?: string;
    name?: string;
  };
  const ct = (attachment.contentType || "").toLowerCase();
  if (ct.startsWith("image/")) {
    return (
      <motion.img
        src={attachment.contentUrl}
        alt={attachment.name || "image"}
        className="max-w-full rounded-lg border border-white/10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
      />
    );
  }
  return (
    <motion.a
      href={attachment.contentUrl}
      target="_blank"
      rel="noreferrer"
      className="text-sm underline break-all"
      title={attachment.name || "attachment"}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      {attachment.name || attachment.contentUrl}
    </motion.a>
  );
}
