import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { isValidObjectId, Types } from "mongoose";

@ValidatorConstraint()
export class IsMongoId implements ValidatorConstraintInterface {
    public async validate(mongoId: Types.ObjectId, args: ValidationArguments) {
        return isValidObjectId(mongoId);
    }
}