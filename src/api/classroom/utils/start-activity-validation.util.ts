import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Classroom, Post } from '../entities';
import { convertToMongoId, isFromClass, isPureArrayOfClass } from 'src/utils';
import { isUserInClassroom } from './is-user-in-classroom.util';
import { PostActivityResult, PostTypes } from '../types';
import { StartActivityDto } from '../dto';

/**
 * Helper function that validate start activity request.
 * @author andr3z0
 **/
export function startActivityValidation(
  post: Post,
  startActivityDto: StartActivityDto,
) {
  if (!isFromClass<Classroom>(post.classroom, 'members'))
    throw new Error('Wrong population of post entity!');
  if (post.type === PostTypes.N || !post.activities)
    throw new BadRequestException(
      'Para iniciar a atividade, o post deve ser do tipo A!',
    );

  if (!isUserInClassroom(post.classroom, startActivityDto.userId))
    throw new NotFoundException(
      'O usuário não se encontra na classe onde o post foi feito!',
    );
  if (
    !post.activities.find((activity) =>
      activity._id.equals(startActivityDto.activityId),
    )
  )
    throw new NotFoundException(
      `Não existe uma atividade com o ID: ${startActivityDto.activityId} cadastrada neste post.`,
    );
  const postActivities = post.postActivityResult;
  if (!isPureArrayOfClass<PostActivityResult>(postActivities, 'user'))
    throw new Error('Wrong return from post repository');
}
