import { ForbiddenException } from "@nestjs/common";
import { Classroom } from "../entities";

export function isClassroomTeacher(classroom: Classroom, possibleTeacherId: string) {
    if (!classroom.teacher._id.equals(possibleTeacherId))
        throw new ForbiddenException(
            `Apenas o professor da sala de ID: ${classroom._id.toString()} pode aprovar novos membros!`,
        );
    return true
}
