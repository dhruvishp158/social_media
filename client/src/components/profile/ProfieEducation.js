import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfieEducation = ({
  education: { school, degree, fieldofstudy, to, from, description },
}) => {
  return (
    <div>
      <h3 className='dark'>{school}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{from}</Moment>
        {" - "}
        {!to ? "Now" : <Moment format='YYYY/MM/DD'>{to}</Moment>}{" "}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field of study: </strong>
        {fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfieEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfieEducation;
