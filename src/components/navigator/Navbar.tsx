"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { RainbowButton } from "../magicui/rainbow-button";
import { SparklesText } from "../magicui/sparkles-text";

interface Props {
  status: number;
}

export default function Navbar({ status }: Props) {
  const statusMap: Record<number, { color: string; label: string }> = {
    0: { color: "bg-gray-400", label: "Uninitialized" },
    1: { color: "bg-yellow-400", label: "Connecting…" },
    2: { color: "bg-green-500", label: "Online" },
    3: { color: "bg-orange-500", label: "Expired" },
    4: { color: "bg-red-500", label: "Failed" },
    5: { color: "bg-gray-500", label: "Ended" },
  };

  const { color, label } = statusMap[status] ?? {
    color: "bg-gray-400",
    label: "Unknown",
  };

  return (
    <div className="flex items-center justify-between w-full h-fit px-8 py-5 border-b border-neutral-300 bg-neutral-50">
      <div className="flex items-center gap-2">
        <SparklesText className="text-2xl font-bold" sparklesCount={4}>
          น้องบิลน้ำมัน
        </SparklesText>
        <div className="relative flex items-center gap-1">
          <span
            className={`h-3 w-3 rounded-full ${color} animate-pulse`}
            title={label}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <RainbowButton>⚡️ Upgrade</RainbowButton>
        <InformationCircleIcon className="h-6 w-6 text-neutral-600" />
      </div>
    </div>
  );
}
