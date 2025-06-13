import { NewPasswordInput } from "@/src/modules/auth/pass-recovery/inputs/new-password.input";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'isPassword', async: false })
export class IsPasswordMatch implements ValidatorConstraintInterface {

    validate(confirmPassword: string, args: ValidationArguments) {
        const object = args.object as NewPasswordInput;
        return confirmPassword === object.password;
    }

    defaultMessage() {
        return 'Passwords do not match';
    }

}
