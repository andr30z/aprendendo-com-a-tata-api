import { Classroom } from '../entities';

/**
 * Verify if user is present in a given classroom
 * @author andr3z0
 **/
export function isUserInClassroom(classroom: Classroom, userId: string) {
  return !(
    !(classroom.teacher._id.toString() === userId) &&
    !classroom.members.find((member) => member._id.toString() === userId)
  );
}
