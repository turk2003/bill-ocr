'use client';

import { useEffect } from "react";

declare global {
  interface Window {
    WebChat: {
      createStore: (
        init?: unknown,
        middleware?: (storeAPI: { dispatch: (action: WebChatAction) => void }) =>
          (next: (action: WebChatAction) => void) =>
            (action: WebChatAction) => void
      ) => unknown;
      createDirectLine: (options: { domain: string; token: string }) => unknown;
      renderWebChat: (
        props: {
          directLine: unknown;
          styleOptions?: Record<string, string>;
          store?: unknown;
        },
        element: HTMLElement | null
      ) => unknown;
    };
  }
}

interface WebChatAction {
  type: string;
  payload?: unknown;
  meta?: unknown;
}

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botframework.com/botframework-webchat/latest/webchat.js";
    script.async = true;

    script.onload = () => {
      let directLineUrl: string | null = null;

      const tokenEndpoint =
        "https://defaulta2339f6dbf4a44db88eccb8f27da4a.bb.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr62c_cnEQ_WkZEytvd673K9xMI/directline/token?api-version=2022-03-01-preview";

      const styleOptions = {
        accent: "#7c3aed",
        backgroundColor: "#181028",
        botAvatarImage:
          "https://powercatexternal.blob.core.windows.net/creatorkit/Assets/ChatbotLogoBlue.png",
        bubbleBackground: "#312e81",
        bubbleTextColor: "#fff",
        bubbleFromUserBackground: "#a084e8",
        bubbleFromUserTextColor: "#181028",
        sendBoxBackground: "#181028",
        sendBoxTextColor: "#fff",
        sendBoxButtonColor: "#a084e8",
        sendBoxButtonColorOnHover: "#7c3aed",
        suggestedActionBackgroundColor: "#7c3aed",
        suggestedActionTextColor: "#fff",
      };

      function createCustomStore() {
        return window.WebChat.createStore(
          {},
          ({ dispatch }) =>
            (next) =>
              (action: WebChatAction) => {
                if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
                  dispatch({
                    type: "DIRECT_LINE/POST_ACTIVITY",
                    meta: { method: "keyboard" },
                    payload: {
                      activity: {
                        channelData: { postBack: true },
                        name: "startConversation",
                        type: "event",
                      },
                    },
                  });
                }
                return next(action);
              }
        );
      }

      const environmentEndPoint = tokenEndpoint.slice(
        0,
        tokenEndpoint.indexOf("/powervirtualagents")
      );
      const apiVersion = tokenEndpoint
        .slice(tokenEndpoint.indexOf("api-version"))
        .split("=")[1];
      const regionalChannelSettingsURL = `${environmentEndPoint}/powervirtualagents/regionalchannelsettings?api-version=${apiVersion}`;

      async function initializeChat() {
        try {
          const response = await fetch(regionalChannelSettingsURL);
          const data: {
            channelUrlsById: { directline?: string };
          } = await response.json();

          directLineUrl = data.channelUrlsById.directline ?? null;
          if (!directLineUrl) throw new Error("Failed to get DirectLine URL");

          const conversationResponse = await fetch(tokenEndpoint);
          const conversationInfo: { token?: string } = await conversationResponse.json();

          if (!conversationInfo.token) throw new Error("Failed to get conversation token");

          const directLine = window.WebChat.createDirectLine({
            domain: `${directLineUrl}v3/directline`,
            token: conversationInfo.token,
          });

          window.WebChat.renderWebChat(
            {
              directLine,
              styleOptions,
              store: createCustomStore(),
            },
            document.getElementById("webchat")
          );
        } catch (err) {
          console.error("Failed to initialize chat:", err);
        }
      }

      initializeChat();
    };

    document.body.appendChild(script);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2d0036] to-[#6e2ca6] flex items-center justify-center">
      <div className="w-full max-w-lg h-[600px] rounded-2xl shadow-2xl bg-[#181028] border-2 border-[#a084e8] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#7c3aed] to-[#a084e8]">
          <img
            src="/Logo_of_the_Provincial_Electricity_Authority_of_Thailand.svg.png"
            alt="PEA Logo"
            className="h-10 w-10 rounded-full bg-white"
          />
          <span className="text-white text-lg font-bold tracking-wide">
            น้องบิลน้ำมัน
          </span>
        </div>
        {/* Chat area */}
        <div id="webchat" className="flex-1 overflow-y-auto" />
      </div>
    </main>
  );
}
