export const POPULATE_PATH_ACTIVITY_RESULT = [
  {
    path: 'activity',
    model: 'Activity',
    select: '_id name color difficulty',
  },
  {
    path: 'user',
    model: 'User',
    select: '_id name',
  },
  {
    path: 'activityAnswers',
    model: 'ActivityAnswers',
    populate: [
      {
        path: 'activity',
      },
    ],
  },
];
