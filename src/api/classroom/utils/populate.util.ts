export const getPopulateCommentsOrPosts = (isComments?: boolean) => ({
  path: isComments ? 'post.classroom' : 'classroom',
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
  COMMENT: ['author', 'post', getPopulateCommentsOrPosts(true)],
};
