export const getPopulateCommentsOrPosts = () => ({
  path: 'classroom',
  model: 'Classroom',
  select:"-classPhoto -pendingJoinRequests",
  populate: [
    {
      path: 'teacher',
      model: 'User',
    },
    {
      path: 'members',
      model: 'User',
    },
  ],
});
export const getPopulateComments = (
  withPostClassRoom = false,
  postSelect?: any,
) => {
  const posts = withPostClassRoom ? [getPopulateCommentsOrPosts()] : [];
  return [
    'author',
    {
      path: 'post',
      model: 'Post',
      select: postSelect,
      populate: [
        ...posts,
        {
          path: 'author',
          model: 'User',
        },
      ],
    },
  ];
};

export const POPULATE_PATHS = {
  CLASSROOM: ['teacher', 'members', 'pendingJoinRequests'],
  POST: ['author', 'activities', getPopulateCommentsOrPosts()],
  COMMENT: getPopulateComments(true),
};
