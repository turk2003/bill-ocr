"use client";

import {
  Bars3BottomLeftIcon,
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between w-72 h-full border-r border-neutral-300 bg-neutral-50">
      <div className="flex flex-col gap-8 px-4 py-6 ">
        <div className="flex items-center gap-2 justify-between w-full">
          <div className="flex items-center gap-1">
            <div className="h-6 w-6 bg-neutral-600 rounded-full"></div>
            <div className="text-xl font-bold">RPA Automation</div>
          </div>
          <Bars3BottomLeftIcon className="h-5 w-5 text-neutral-600" />
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.refresh()}
            className="flex items-center gap-1 px-3 h-[42px] rounded-xl hover:bg-neutral-200 cursor-pointer"
          >
            <ChatBubbleLeftIcon className="h-5 w-5 text-neutral-600" />
            <span className="ml-2 text-sm font-medium">New Chat</span>
          </button>
          <div className="flex gap-1 items-center border border-neutral-300 px-3 py-2 rounded-xl">
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-600" />
            <input
              type="text"
              placeholder="Search"
              className="border-none outline-none"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 border-t border-neutral-300">
        <div className="h-10 w-10 bg-neutral-600 rounded-full"></div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold">Heart888</div>
          <div className="text-sm text-neutral-500">heart@pea.co.th</div>
        </div>
      </div>
    </div>
  );
}
