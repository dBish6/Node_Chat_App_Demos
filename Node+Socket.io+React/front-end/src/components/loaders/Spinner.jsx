const Spinner = ({ style }) => {
  return (
    <div
      style={{
        border: "solid 4px var(--accent-a5)",
        borderTop: "solid 4px var(--accent-a11)",
        borderRadius: "50%",
        width: "2rem",
        height: "2rem",
        animation:
          "spinner 1.2s infinite cubic-bezier(0.785, 0.135, 0.15, 0.86)",
        ...style,
      }}
    />
  );
};

export default Spinner;
