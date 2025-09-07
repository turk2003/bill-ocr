"use client";

import { ChatBubbleLeftRightIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { BentoCard, BentoGrid } from "../magicui/bento-grid";
import { LineShadowText } from "../magicui/line-shadow-text";
import AnimatedListDemo from "./List";
import AnimatedBeamMultipleOutputDemo from "./Beam";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Greeting({ open, onClose }: Props) {
  const features = [
    {
      Icon: () => <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      name: "Next-Gen AI Chatbot",
      description: "Your personal assistant for all things PEA.",
      href: () => onClose(),
      cta: "เริ่มต้นแชท",
      className: "col-span-3 lg:col-span-1",
      background: (
        <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
      ),
    },
    {
      Icon: () => <PhotoIcon className="h-8 w-8" />,
      name: "OCR & RPA",
      description: "Scan your bills and automate tasks.",
      href: () => onClose(),
      cta: "เริ่มต้นแชท",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
      ),
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute z-10 top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-full px-8">
            <LineShadowText
              className="text-4xl font-bold w-full"
              shadowColor={"black"}
            >
              น้องบิลน้ำมัน ยินดีต้อนรับ
            </LineShadowText>
            <p className="text-lg text-gray-600">
              ระบบช่วยเหลือการจัดการบิลน้ำมัน
            </p>
          </div>

          <BentoGrid className="p-8">
            {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
