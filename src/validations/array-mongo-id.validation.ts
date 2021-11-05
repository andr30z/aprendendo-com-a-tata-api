import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { isValidObjectId, Types } from "mongoose";

@ValidatorConstraint()
export class IsArrayOfMongoIds implements ValidatorConstraintInterface {
    public async validate(mongoIdArray: Types.ObjectId[], args: ValidationArguments) {
        if (!Array.isArray(mongoIdArray)) return false;
        const invalidIds = mongoIdArray.filter(x => !isValidObjectId(x))
        return invalidIds.length === 0;
    }
}