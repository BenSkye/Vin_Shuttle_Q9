import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/share/enums";

export interface ICreateUserDto {
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}

export interface IUpdateUserDto {
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    status?: string;
}

export class CreateUserDto {
    @ApiProperty({
        default: 'User Name',
        example: 'KhanhHg',
        minLength: 2,
        maxLength: 100,
    })
    name: string;

    @ApiProperty({
        description: 'User phone',
        example: '00800808808',
    })
    phone: string;

    @ApiProperty({
        description: 'User Email',
        example: 'KhanhHg8386@gmail.com',
        required: false
    })
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'Khanhdz123',
        required: false
    })
    password: string;


    @ApiProperty({
        description: 'User role',
        example: 'customer',
        required: false
    })
    role: UserRole;

}