import React, { Fragment } from "react";
import spinner from "./spinner.jpg";

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: "200px", margin: "auto", display: "block" }}
      alt='Spinner '
    />
  </Fragment>
);
