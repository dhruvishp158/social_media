import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { getPost } from "../../actions/post";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
const Posts = ({ getPost, post: { posts, loading } }) => {
  useEffect(() => {
    getPost();
  }, [getPost]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>Welcome to community
      </p>
      <PostForm />
      {posts.map((post) => (
        <PostItem key={post._id} post={post} clg />
      ))}
    </Fragment>
  );
};

Posts.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});
export default connect(mapStateToProps, { getPost })(Posts);
