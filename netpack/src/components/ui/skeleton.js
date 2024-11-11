import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Skeleton = ({ width = "100%", height = "16px", className }) => {
  return (
    <div
      className={classNames("bg-gray-300 animate-pulse rounded", className)}
      style={{ width, height }}
    ></div>
  );
};

Skeleton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
};

export default Skeleton;
