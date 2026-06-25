interface HeroProps {
  onEnrollClick: () => void;
}

const Hero = ({ onEnrollClick }: HeroProps) => {
  return (
    <div className="text-center py-16 px-6">
      <h1 className="text-4xl font-bold leading-tight">
        Bridge between users
        <br />
        and eco businesses
      </h1>
      <p className="text-gray-400 mt-3">
        Connecting you to a more sustainable world
      </p>
      <button
        onClick={onEnrollClick}
        className="mt-6 bg-[#B5481F] text-white font-semibold px-6 py-3 rounded-md"
      >
        Enroll Now
      </button>
    </div>
  );
};

export default Hero;