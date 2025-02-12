import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export interface ICreateDriverSchedule {
    driver: string;
    date: Date;
    shift: string;
    vehicle: string;
}

export interface IUpdateDriverSchedule {
    driver?: string;
    date?: Date;
    shift?: string;
    vehicle?: string;
    status?: string;
    checkinTime?: Date;
    checkoutTime?: Date;
    isLate?: boolean;
    isEarlyCheckout?: boolean;
}

export class CreateDriverScheduleDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    driver: string;
    @ApiProperty({ example: '2023-10-01' })
    date: Date;
    @ApiProperty({ example: 'A' })
    shift: string;
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    vehicle: string;
}

export class UpdateDriverScheduleDto {
    @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
    driver: string;
    @ApiPropertyOptional({ example: '2023-10-01' })
    date: Date;
    @ApiPropertyOptional({ example: 'A' })
    shift: string;
    @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
    vehicle: string;
    @ApiPropertyOptional({ example: 'not_started' })
    status: string;
    //hour
    @ApiPropertyOptional({ example: '2023-10-01' })
    checkinTime: Date;
    @ApiPropertyOptional({ example: '2023-10-01' })
    checkoutTime: Date;
    @ApiPropertyOptional({ example: false })
    isLate: boolean;
    @ApiPropertyOptional({ example: false })
    isEarlyCheckout: boolean;
}