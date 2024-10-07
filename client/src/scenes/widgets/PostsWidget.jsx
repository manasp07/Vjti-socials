import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  const getUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
      return {
        branch: userData.branch,
        year: userData.year
      };
    } catch (error) {
      console.error(`Failed to fetch data for user ${userId}:`, error);
      return null;
    }
  };

  const sortPosts = async (postsArray) => {
    if (!user) return postsArray;

    const postsWithUserData = await Promise.all(
      postsArray.map(async (post) => {
        const userData = await getUserData(post.userId);
        return { ...post, ...userData };
      })
    );

    return postsWithUserData.sort((a, b) => {
      // First, prioritize by branch
      const isAPriorityBranch = a.branch === user.branch;
      const isBPriorityBranch = b.branch === user.branch;

      if (isAPriorityBranch && !isBPriorityBranch) return -1;
      if (!isAPriorityBranch && isBPriorityBranch) return 1;

      // If both posts are from the same branch, prioritize by year
      const isAPriorityYear = a.year === user.year;
      const isBPriorityYear = b.year === user.year;

      if (isAPriorityYear && !isBPriorityYear) return -1;
      if (!isAPriorityYear && isBPriorityYear) return 1;

      return 0; // If both branch and year are the same, maintain their order
    });
  };

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("Fetched Posts:", data);
      if (Array.isArray(data)) {
        const sortedPosts = await sortPosts(data);
        console.log("These are the sorted posts", sortedPosts);
        dispatch(setPosts({ posts: sortedPosts }));
      } else {
        console.error("Fetched data is not an array:", data);
        dispatch(setPosts({ posts: [] }));
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      dispatch(setPosts({ posts: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      console.log("Fetched User Posts:", data);
      if (Array.isArray(data)) {
        const sortedPosts = await sortPosts(data);
        dispatch(setPosts({ posts: sortedPosts }));
      } else {
        console.error("Fetched data is not an array:", data);
        dispatch(setPosts({ posts: [] }));
      }
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      dispatch(setPosts({ posts: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [user]); // Add user as a dependency

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <>
      {console.log("Posts state:", posts)}
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            hometown,
            picturePath,
            userPicturePath,
            likes,
            comments,
            branch,
            year,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              hometown={hometown}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
              userBranch={branch}
              userYear={year}
            />
          )
        )
      ) : (
        <div>No posts present</div>
      )}
    </>
  );
};

export default PostsWidget;