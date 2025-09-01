"use client";

import {
  Bars3BottomLeftIcon,
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`flex flex-col justify-between ${
        open ? "w-72" : "w-16"
      } h-full border-r border-neutral-300 bg-neutral-50`}
    >
      <div className={`flex flex-col gap-8 ${open ? "px-4" : "px-2"} py-6`}>
        <div
          className={`flex ${
            open ? "flex-row" : "flex-col-reverse"
          } items-center gap-2 justify-between w-full`}
        >
          <div className="flex items-center gap-1">
            <div className="h-6 w-6 bg-neutral-600 rounded-full"></div>
            {open && <div className="text-xl font-bold">RPA Automation</div>}
          </div>
          <button
            className="p-2 hover:bg-neutral-200 rounded-lg cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <Bars3BottomLeftIcon className="h-5 w-5 text-neutral-600" />
          </button>
        </div>
        <div className="flex items-center flex-col gap-2">
          <button
            onClick={() => window.location.reload()}
            className={`flex items-center gap-1 p-2 h-[42px] rounded-lg hover:bg-neutral-200 cursor-pointer ${
              open ? "w-full" : "w-fit"
            }`}
          >
            <ChatBubbleLeftIcon className="h-5 w-5 text-neutral-600" />
            {open && <span className="ml-2 text-sm font-medium">New Chat</span>}
          </button>
          <div
            className={`flex gap-1 items-center border border-neutral-300 px-3 py-2 rounded-lg ${
              open ? "w-full" : "w-fit"
            }`}
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-600" />
            {open && (
              <input
                type="text"
                placeholder="Search"
                className="border-none outline-none"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 border-t border-neutral-300">
        <div className="h-8 w-8 bg-neutral-600 rounded-full"></div>
        {open && (
          <div className="flex flex-col">
            <div className="text-sm font-semibold">Heart888</div>
            <div className="text-sm text-neutral-500">heart@pea.co.th</div>
          </div>
        )}
      </div>
    </div>
  );
}
