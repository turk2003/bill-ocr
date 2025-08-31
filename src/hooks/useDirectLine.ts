"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DirectLine,
  ConnectionStatus,
  Activity,
} from "botframework-directlinejs";

type Sub = { unsubscribe: () => void };

export function useDirectLine(userId?: string) {
  const [directLine, setDirectLine] = useState<DirectLine | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [typing, setTyping] = useState(false);

  const activitySubRef = useRef<Sub | null>(null);
  const connSubRef = useRef<Sub | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  const myId = useMemo(() => {
    if (userId) return userId;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat.myId");
      if (saved) return saved;
      const gen = `user-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("chat.myId", gen);
      return gen;
    }
    return `user-${Math.random().toString(36).slice(2)}`;
  }, [userId]);

  useEffect(() => {
    let dl: DirectLine;

    (async () => {
      const res = await fetch("/api/pva/token", { method: "POST" });
      const data = await res.json();
      if (!data?.token) throw new Error("Cannot get Direct Line token");

      dl = new DirectLine({ token: data.token });
      setDirectLine(dl);

      connSubRef.current = dl.connectionStatus$.subscribe(setStatus);

      activitySubRef.current = dl.activity$.subscribe((activity) => {
        const isBot = activity.from?.id !== myId;

        if (isBot && activity.type === "typing") {
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

          setTyping(true);

          typingTimeoutRef.current = setTimeout(() => {
            setTyping(false);
            typingTimeoutRef.current = null;
          }, 5000);

          return;
        }

        if (isBot && activity.type !== "typing") {
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
          setTyping(false);
        }

        setActivities((prev) => [...prev, activity]);
      });
    })();

    return () => {
      activitySubRef.current?.unsubscribe?.();
      connSubRef.current?.unsubscribe?.();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      dl?.end?.();
    };
  }, [myId]);

  useEffect(() => {
    if (status === 2 && directLine && !startedRef.current) {
      startedRef.current = true;
      directLine
        .postActivity({
          type: "event",
          name: "startConversation",
          from: { id: myId, role: "user" },
          channelData: { postBack: true },
          value: { locale: "th-TH" },
        })
        .toPromise();
    }
  }, [status, directLine, myId]);

  const sendMessage = async (text: string) => {
    if (!directLine || !text.trim()) return;
    await directLine
      .postActivity({
        type: "message",
        from: { id: myId, role: "user" },
        text,
      })
      .toPromise();
  };

  const sendEvent = async (
    name: string,
    value?: unknown,
    channelData?: unknown
  ) => {
    if (!directLine) return;
    await directLine
      .postActivity({
        type: "event",
        name,
        from: { id: myId, role: "user" },
        value,
        ...(channelData ? { channelData } : {}),
      })
      .toPromise();
  };

  const sendFiles = async (files: FileList) => {
    if (!directLine || !files?.length) return;

    const toDataURL = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = () => reject(new Error("file read error"));
        fr.onload = () => resolve(fr.result as string);
        fr.readAsDataURL(file);
      });

    const attachments = await Promise.all(
      Array.from(files).map(async (f) => ({
        contentType: f.type || "application/octet-stream",
        contentUrl: await toDataURL(f),
        name: f.name,
      }))
    );

    await directLine
      .postActivity({
        type: "message",
        from: { id: myId, role: "user" },
        attachments,
      })
      .toPromise();
  };

  return {
    directLine,
    activities,
    status,
    typing,
    sendMessage,
    sendEvent,
    sendFiles,
    myId,
  };
}
