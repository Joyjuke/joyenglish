
const ShowPickSlogan = () => {
  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Gray box placeholder */}
          <div className="w-full h-80 bg-gray-300 rounded-lg"></div>
          
          {/* Right side - Show Pick text */}
          <div className="text-center lg:text-left">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Show Pick
            </h2>
            <p className="text-2xl md:text-3xl text-white/80 mt-4">
              슬로건
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowPickSlogan;
