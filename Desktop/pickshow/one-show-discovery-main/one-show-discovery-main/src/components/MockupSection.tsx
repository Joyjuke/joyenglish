const MockupSection = () => {
  return (
    <div className="mockup-section">
      <div className="flex flex-col gap-4 md:hidden">
        <img src="/lovable-uploads/ui1.png" alt="UI 1" className="rounded-2xl shadow-2xl" style={{ width: "90vw", maxWidth: "1980px", height: "auto" }} />
        <img src="/lovable-uploads/ui2.png" alt="UI 2" className="rounded-2xl shadow-2xl" style={{ width: "90vw", maxWidth: "1980px", height: "auto" }} />
        <img src="/lovable-uploads/ui3.png" alt="UI 3" className="rounded-2xl shadow-2xl" style={{ width: "90vw", maxWidth: "1980px", height: "auto" }} />
        <img src="/lovable-uploads/ui4.png" alt="UI 4" className="rounded-2xl shadow-2xl" style={{ width: "90vw", maxWidth: "1980px", height: "auto" }} />
      </div>
    </div>
  );
};

export default MockupSection;
