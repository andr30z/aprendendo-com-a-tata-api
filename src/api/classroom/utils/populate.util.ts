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

export const POPULATE_PATHS = {
  CLASSROOM: ['teacher', 'members'],
  POST: ['author', 'classroom', getPopulateCommentsOrPosts()],
  COMMENT: [
    'author',
    {
      path: 'post',
      model: 'Post',
      populate: [
        getPopulateCommentsOrPosts(),
        {
          path: 'author',
          model: 'User',
        },
      ],
    },
  ],
};
