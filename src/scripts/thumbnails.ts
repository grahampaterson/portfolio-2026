import { thumbnails } from "../data/thumbnails";

export const initScript = () => {
  const startIndex = Math.floor(Math.random() * thumbnails.length);

  const viewer = document.querySelector<HTMLDivElement>("#viewer");
  const img = document.querySelector<HTMLImageElement>("#current-image");
  const vid = document.querySelector<HTMLVideoElement>("#current-video");
  const vidSrc = document.querySelector<HTMLSourceElement>("#vid-source");
  if (!(viewer && vid && img && vidSrc)) return;

  let remaining = Array.from(Array(thumbnails.length)).map((_, i) => i);
  remaining.splice(startIndex, 1);

  let projectIndex = startIndex;
  let imageIndex = 0;

  const setThumbnail = () => {
    // randomises the order but always progresses throught he current sequence
    if (imageIndex === thumbnails[projectIndex].filename.length - 1) {
      imageIndex = 0;
      if (remaining.length === 1) {
        remaining = Array.from(Array(thumbnails.length)).map((_, i) => i);
        remaining.splice(projectIndex, 1);
      }
      let randomIndex = Math.floor(Math.random() * remaining.length);
      projectIndex = remaining[randomIndex];
      remaining.splice(randomIndex, 1);
    } else {
      imageIndex = imageIndex + 1;
    }

    let filename = thumbnails[projectIndex].filename[imageIndex];
    if (filename.search("webm") > -1) {
      vid.style.display = "block";
      img.style.display = "none";
      vidSrc.src = filename;
      vid.load();
      vid.play();
    } else {
      vid.style.display = "none";
      img.style.display = "block";
      img.src = filename;
    }
  };

  // initialise
  setThumbnail();
  viewer.style.visibility = "visible";

  // set up listener
  viewer.addEventListener("click", setThumbnail);
};
