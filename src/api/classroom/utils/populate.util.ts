export const getPopulateCommentsOrPosts = () => ({
  path: 'classroom',
  model: 'Classroom',
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
  CLASSROOM: ['teacher', 'members'],
  POST: ['author', 'classroom', getPopulateCommentsOrPosts()],
  COMMENT: getPopulateComments(true),
};
