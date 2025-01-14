export const capitalize = (string) => {
  if (!string) return "";
  return string
    ?.split(" ")
    ?.map((word) =>
      word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : "",
    )
    .join(" ");
};

const SI_SYMBOL = ["", "k", "M", "T", "P", "E"];

export const abbreviateNumber = (number) => {
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  if (tier == 0) return number;

  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  const scaled = number / scale;

  return scaled.toFixed(1) + suffix;
};
