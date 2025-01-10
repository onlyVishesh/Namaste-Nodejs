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

export const timeSince = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  if (Math.floor(interval) === 1) {
    return Math.floor(interval) + " year ago";
  }
  if (Math.floor(interval) > 1) {
    return Math.floor(interval) + " years ago";
  }

  interval = seconds / 2592000;
  if (Math.floor(interval) === 1) {
    return Math.floor(interval) + " month ago";
  }
  if (Math.floor(interval) > 1) {
    return Math.floor(interval) + " months ago";
  }

  interval = seconds / 86400;
  if (Math.floor(interval) > 13) {
    return Math.floor(interval / 7) + " weeks ago";
  } else if (Math.floor(interval) === 1) {
    return Math.floor(interval) + " day ago";
  } else if (Math.floor(interval) > 1) {
    return Math.floor(interval) + " days ago";
  }

  interval = seconds / 3600;
  if (Math.floor(interval) === 1) {
    return Math.floor(interval) + " hour ago";
  }
  if (Math.floor(interval) > 1) {
    return Math.floor(interval) + " hours ago";
  }

  interval = seconds / 60;
  if (Math.floor(interval) === 1) {
    return Math.floor(interval) + " minute ago";
  }
  if (Math.floor(interval) > 1) {
    return Math.floor(interval) + " minutes ago";
  }

  return Math.floor(seconds) + " seconds";
};
