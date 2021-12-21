import { Activity } from '../entities';
import { ActivityAnswers, ActivityTypes, AvaliationMethods } from '../types';

function countingAnswers(activityAnswers: Array<ActivityAnswers>) {
  return activityAnswers;
}

export function activityResultLogic(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
) {
  switch (activity.type) {
    case ActivityTypes.CMP:
      return comparationBetweenObjects(activityAnswers, activity);
    case ActivityTypes.LCOT:
      return learningCharacteristicsOfThings(activityAnswers, activity);
    default:
      return 0;
  }
}

function convertTo5PointsRatingNotation(score: number, totalQuestions: number) {
  return Math.floor((score / totalQuestions) * 5);
}

function loopActivityAnswers(
  activityAnswers: Array<ActivityAnswers>,
  callback: (answer: any, stageIndex: number) => void,
) {
  activityAnswers.forEach((answer, stageIndex) => {
    answer.activity.forEach((activity: any) => {
      callback(activity, stageIndex);
    });
  });
}

/**
 * 61a2d1ede89cdada512d0faa
 * Calculates user activity result for comparation between objects activity.
 * @author andr3z0
 **/
function comparationBetweenObjects(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
) {
  let totalCorrectAnswers = 0;
  const stages = activity.stages;
  loopActivityAnswers(activityAnswers, (activity, stageIndex) => {
    const currentStage: Array<any> = stages[stageIndex];
    if (!currentStage) return;
    const bondIsValid =
      currentStage.find(
        (comparationItem) =>
          comparationItem.comparationBondValue === activity.senderId &&
          comparationItem._id.toString() === activity.receiverId,
      ) !== undefined;
    if (bondIsValid) totalCorrectAnswers++;
  });

  let totalQuestions = 0;
  activity.stages.forEach((stage) => {
    totalQuestions = totalQuestions + stage.length;
  });

  return convertTo5PointsRatingNotation(totalCorrectAnswers, totalQuestions);
}

export function learningCharacteristicsOfThings(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
) {
  let totalCorrectAnswers = 0;
  loopActivityAnswers(activityAnswers, (answer, stageIndex) => {
    const currentStage = activity.stages[stageIndex];
    if (
      currentStage.characteristicsItems.find(
        (item: any) =>
          item._id.toString() === answer && item.imageIsCharacteristic,
      )
    )
      totalCorrectAnswers++;
  });
  let totalQuestions = 0;
  activity.stages.forEach((stage) => {
    totalQuestions = totalQuestions + stage.characteristicsItems.length;
  });

  return convertTo5PointsRatingNotation(totalCorrectAnswers, totalQuestions);
}
