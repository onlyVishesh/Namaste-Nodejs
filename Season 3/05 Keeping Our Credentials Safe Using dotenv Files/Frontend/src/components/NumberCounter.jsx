import { useEffect, useState } from "react";

const NumberCounter = ({ endNumber, triggerRef, duration = 1000 }) => {
  const [number, setNumber] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!triggerRef?.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateNumber(0, endNumber, duration);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [endNumber, hasAnimated, triggerRef]);

  const animateNumber = (start, end, duration) => {
    const frames = duration / 16;
    const step = Math.max(1, Math.ceil(end / frames));

    const updateNumber = (current) => {
      if (current < end) {
        setNumber((prev) => Math.min(prev + step, end));
        requestAnimationFrame(() => updateNumber(current + step));
      }
    };

    updateNumber(start);
  };

  return <span>{number.toLocaleString()}+</span>;
};

export default NumberCounter;
