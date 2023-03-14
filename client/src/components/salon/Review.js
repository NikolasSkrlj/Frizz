import React from "react";

import { formatDistanceToNow } from "date-fns";

import { Row, Col, Media } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import hr from "date-fns/locale/hr";

const Review = ({ review }) => {
  return (
    <Media key={review._id}>
      <img
        width={50}
        height={50}
        className="mr-3 rounded-circle"
        src={
          review.userId.profilePic
            ? `${process.env.REACT_APP_API_URL}/user/${review.userId._id}/profile_pic`
            : review.userId.gender === "M"
            ? "https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"
            : "https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"
        }
        alt="Generic placeholder"
      />
      <Media.Body>
        <Row>
          <Col sm={12}>
            <h5 className="d-inline-block">{review.userId.name}</h5>
            <span className="text-muted mx-1">
              <small>
                {formatDistanceToNow(new Date(review.updatedAt), {
                  addSuffix: true,
                  locale: hr,
                })}
              </small>
            </span>
            <div className="align-middle">
              <h6>
                <StarRatings
                  starDimension="18px"
                  starSpacing="3px"
                  rating={review.rating}
                  starRatedColor="orange"
                  numberOfStars={5}
                  name="Ocjena"
                  className="d-inline-block align-middle"
                />
              </h6>
            </div>

            <p>
              <span className="text-muted">
                {review.hairdresserId
                  ? `[frizer - ${review.hairdresserId.name}] `
                  : "[salon] "}
              </span>
              {review.comment || ""}
            </p>
          </Col>
        </Row>
      </Media.Body>
    </Media>
  );
};

export default Review;
