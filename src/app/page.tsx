export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#BBDED6]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src="/Logo_of_the_Provincial_Electricity_Authority_of_Thailand.svg.png"
          alt="PEA Logo"
          className="h-14 rounded-xl   "
        />
        <span className="text-green-800 text-3xl font-bold tracking-wider font-sans">
          น้องบิลน้ำมัน
        </span>
        {/* ถ้ามี mascot ให้เพิ่มตรงนี้ */}
        {/* <img src="/pea-mascot.png" alt="PEA Mascot" className="h-14 ml-3" /> */}
      </div>
      {/* Chat Container */}
      <div className="w-[90vw] max-w-[900px] h-[80vh]  border-2 border-[#FFB6B9] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <iframe
          src="https://copilotstudio.microsoft.com/environments/Default-a2339f6d-bf4a-44db-88ec-cb8f27da4abb/bots/cr62c_cnEQ_WkZEytvd673K9xMI/webchat?__version__=2"
          frameBorder="0"
          className="w-full h-full bg-transparent"
          title="Copilot Studio Webchat"
        />
      </div>
    </div>
  );
}