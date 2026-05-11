import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedErrorResponseDto {
    @ApiProperty({ example: 'Unauthorized' })
    message: string;

    @ApiProperty({ example: 401 })
    statusCode: number;
}