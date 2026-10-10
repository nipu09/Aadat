// Replaces the old heavy GIFs: a muted, looping, autoplaying video (~1 MB instead of 6-11 MB).
export default function LoopVideo({ name, className = "" }) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={`/gifs/${name}.jpg`}
      aria-hidden="true"
      className={className}
    >
      <source src={`/gifs/${name}.webm`} type="video/webm" />
      <source src={`/gifs/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
