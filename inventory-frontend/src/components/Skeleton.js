import React from 'react';

const Skeleton = ({ width = "100%", height = "20px", borderRadius = "8px", margin = "0" }) => {
  const skeletonStyle = {
    width,
    height,
    borderRadius,
    margin,
    background: "linear-gradient(90deg, var(--color-subtle-bg) 25%, var(--color-hover-bg) 50%, var(--color-subtle-bg) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite ease-in-out",
  };

  return (
    <>
      <div style={skeletonStyle} />
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
};

export default Skeleton;
