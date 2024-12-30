import { useEffect, useRef, useState } from "react";

const Card = () => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleExpand = (event) => {
      if (cardRef.current && cardRef.current.contains(event.target)) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };

    window.addEventListener("mouseover", handleExpand);
    return () => {
      window.removeEventListener("mouseover", handleExpand);
    };
  }, []);

  return (
    <div
      className="lg-w-[380px] xl:hover-h-[650px] group relative h-96 w-[380px] select-none rounded-2xl bg-bgSecondary shadow-lg shadow-shadow transition-all duration-700 hover:h-[450px] 2xs:hover:h-[550px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] md:hover:h-[650px] lg:h-96 lg:hover:h-[450px] xl:h-[500px] xl:w-[500px] xl:hover:h-[650px]"
      ref={cardRef}
    >
      <div className="bg-primary/20 absolute -top-12 left-1/2 size-32 -translate-x-1/2 overflow-hidden rounded-2xl bg-opacity-20 bg-clip-padding shadow-sm shadow-cardBg backdrop-blur-lg backdrop-filter transition-all duration-700 group-hover:size-40 2xs:size-36 2xs:group-hover:size-52 md:size-48 md:group-hover:size-64 lg:size-32 lg:group-hover:size-40 xl:size-48 xl:group-hover:size-64">
        <img
          draggable="false"
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt=""
          className="absolute left-0 top-0 size-full object-cover"
        />
      </div>
      <div className="mx-auto flex h-[85%] w-10/12 flex-col items-center justify-end gap-2 xl:h-[87%]">
        <h2 className="text-xl font-bold md:text-2xl">Name Name</h2>
        <p className="text-textMuted md:text-lg">@username</p>
        <p className="sm:text-lg md:text-xl">skills</p>
        <div
          className={`overflow-hidden transition-[max-height] duration-700 ${
            expanded ? "max-h-[300px]" : "max-h-[80px] xl:max-h-[120px]"
          }`}
        >
          <p
            className={`text-md duration-800 line-clamp-6 transition-all md:line-clamp-[7] md:text-lg lg:line-clamp-5 xl:line-clamp-[8]${
              expanded ? "" : ""
            }`}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint ipsum
            quae et eos rem nobis, at suscipit excepturi quaerat maiores saepe
            corporis veritatis, tenetur architecto repudiandae quia beatae
            voluptas exercitationem. Provident alias in tempora eligendi debitis
            cumque aut, ab consequatur esse non, quidem quis aspernatur,
            repellendus doloribus ipsa animi repellat. Deserunt aliquid enim
            minus, vero expedita eveniet. At, dolorum in?
          </p>
        </div>
      </div>
      <div className="absolute bottom-2 xl:bottom-3 left-1/2 mx-auto flex w-[90%] -translate-x-1/2 items-center justify-center gap-10">
        <button className="rounded-md bg-primary px-4 py-2 text-text hover:bg-hover md:hidden">
          Expand
        </button>
        <button className="rounded-md bg-primary px-4 py-2 text-text hover:bg-hover">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default Card;
