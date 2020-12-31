export default function SubjectBlock({ url, iconSize, displayedName }) {
  return (
    <>
      <img
        src={`${process.env.PUBLIC_URL}/icons/${url}.svg`}
        alt={`${displayedName}Icon`}
        height={iconSize}
        width={iconSize}
      />
      <br />
      {displayedName}
    </>
  );
}
