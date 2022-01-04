import { BadRequestException } from '@nestjs/common';
import { Activity } from '../entities';
import { ActivityAnswers, ActivityTypes, AvaliationMethods } from '../types';

export function activityResultLogic(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
) {
  switch (activity.type) {
    case ActivityTypes.CMP:
      return comparationBetweenObjects(activityAnswers, activity);
    case ActivityTypes.SC:
      return shapesAndColors(activityAnswers, activity);
    case ActivityTypes.LCOT:
      return learningCharacteristicsOfThings(activityAnswers, activity);
    case ActivityTypes.NS:
      return numberSequence(activityAnswers, activity);
    case ActivityTypes.NO:
      return numberOperation(activityAnswers, activity);
    case ActivityTypes.ST:
      return storytelling(activityAnswers, activity);
    case ActivityTypes.LLDCW:
      return dragLettersToCompleteWords(activityAnswers, activity);
    case ActivityTypes.LLCW:
      return dragLettersToCompleteWords(activityAnswers, activity, true);
    case ActivityTypes.LLI:
      return imagesByLetters(activityAnswers, activity);
    default:
      return 0;
  }
}

function convertTo5PointsRatingNotation(score: number, totalQuestions: number) {
  return Math.round((score / totalQuestions) * 5);
}

function loopActivityAnswers(
  activityAnswers: Array<ActivityAnswers>,
  callback: (answer: any, stageIndex: number, answerIndex: number) => void,
) {
  activityAnswers.forEach((answer, stageIndex) => {
    answer.activity.forEach((activity: any, index: number) => {
      callback(activity, stageIndex, index);
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
    totalQuestions = totalQuestions + stage.length / 2;
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

export function numberSequence(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
) {
  let totalCorrectAnswers = 0;
  let totalQuestions = 0;
  loopActivityAnswers(activityAnswers, (answer, stageIndex, answerIndex) => {
    const currentStage = activity.stages[stageIndex];
    console.log(
      answer,
      currentStage[answerIndex],
      typeof currentStage[answerIndex] !== 'string',
    );
    if (typeof currentStage.sequence[answerIndex] !== 'string') return;
    totalQuestions++;
    if (answerIndex > 0 && currentStage.sequence[answerIndex - 1] === answer - 1)
      return totalCorrectAnswers++;
    if (answerIndex === 0 && currentStage.sequence[answerIndex + 1] === answer + 1)
      totalCorrectAnswers++;
  });
  console.log(totalCorrectAnswers, totalQuestions);

  return convertTo5PointsRatingNotation(totalCorrectAnswers, totalQuestions);
}

function numberOperation(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
) {
  let totalCorrectAnswers = 0;
  let totalQuestions = 0;
  loopActivityAnswers(activityAnswers, (answer, stageIndex, answerIndex) => {
    const currentStage = activity.stages[stageIndex];
    console.log(answer);
    const operation = currentStage.operations.find(
      (x: any) => x._id.toString() === answer.operationId,
    );
    // operationId: string;
    // result?: number;
    if (operation.result === answer.result) totalCorrectAnswers++;
  });

  activity.stages.forEach((stage) => {
    totalQuestions = totalQuestions + stage.operations.length;
  });

  return convertTo5PointsRatingNotation(totalCorrectAnswers, totalQuestions);
}

function storytelling(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
) {
  let totalCorrectAnswers = 0;
  let totalQuestions = activity.story.questions.length;
  loopActivityAnswers(activityAnswers, (answer, _, questionIndex) => {
    const question = activity.story.questions[questionIndex];
    const userSelectedOption = question?.options?.find(
      (opt: any) => opt._id.toString() === answer.answerId,
    );
    if (userSelectedOption?.isCorrect) totalCorrectAnswers++;
  });
  return convertTo5PointsRatingNotation(totalCorrectAnswers, totalQuestions);
}

export function dragLettersToCompleteWords(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
  isLLCW = false,
) {
  let totalCorrectAnswers = 0;
  let totalQuestions = 0;
  loopActivityAnswers(activityAnswers, (answer, stageIndex, answerIndex) => {
    const currentStage = activity.stages[stageIndex];
    console.log(answer);
    const word = currentStage.wordsToComplete[answerIndex];
    // operationId: string;
    // result?: number;
    if (!isLLCW && word.finishedWord === answer) return totalCorrectAnswers++;
    if (isLLCW && answer[word.wordToComplete.indexOf('*')] === word.keyLetter)
      totalCorrectAnswers++;
  });

  activity.stages.forEach((stage) => {
    totalQuestions = totalQuestions + stage.wordsToComplete.length;
  });
  return convertTo5PointsRatingNotation(totalCorrectAnswers, totalQuestions);
}

export function imagesByLetters(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
) {
  let totalCorrectAnswers = 0;
  let totalQuestions = 0;
  loopActivityAnswers(activityAnswers, (answer, stageIndex) => {
    const currentStage = activity.stages[stageIndex];
    console.log(answer);
    answer.forEach((pressedContainer: any) => {
      const lettersItem = currentStage.pressingLettersActivity.find(
        (stageLetters: any) =>
          pressedContainer.imagesContainerId === stageLetters._id.toString(),
      );
      if (!lettersItem)
        throw new BadRequestException('Container de imagens não encontrado!');

      const correctAnswers: [] = lettersItem.images.filter((x: any) =>
        pressedContainer.pressed.includes(x._id.toString()),
      );

      totalCorrectAnswers += correctAnswers.length;
    });
    activity.stages.forEach((stage) => {
      stage.pressingLettersActivity.forEach((imagesContainer: any) => {
        totalQuestions += imagesContainer.images.filter(
          (x: any) => x.imageStartWithInitialLetter,
        ).length;
      });
    });
  });
  return convertTo5PointsRatingNotation(totalCorrectAnswers, totalQuestions);
}

export function shapesAndColors(
  activityAnswers: Array<ActivityAnswers>,
  activity: Activity,
) {
  let totalCorrectAnswers = 0;
  let totalQuestions = 0;
  loopActivityAnswers(activityAnswers, (item, stageIndex) => {
    const currentStage = activity.stages[stageIndex];
    console.log(item, currentStage);
    const headItem = findById(currentStage.columns, item.columnHeadId);
    if (!headItem)
      throw new BadRequestException(
        'Header não encontrado! ID: ' + item.columnHeadId,
      );

    const receiverItem = findById(currentStage.columns, item.receiverId);
    if (!receiverItem)
      throw new BadRequestException(
        'Receiver não encontrado! ID: ' + item.columnHeadId,
      );

    if (receiverItem.isItemReceiver && headItem.isHeadImage)
      totalCorrectAnswers++;
  });
  activity.stages.forEach((stage) => {
    stage.columns.forEach((imagesContainer: any) => {
      totalQuestions += imagesContainer.filter(
        (x: any) => x.isItemReceiver,
      ).length;
    });
  });
  return convertTo5PointsRatingNotation(totalCorrectAnswers, totalQuestions);
}

function findById(array: any[], id: string) {
  for (let p of array) {
    for (let i of p) {
      if (i._id.toString() === id) return i;
    }
  }
}
