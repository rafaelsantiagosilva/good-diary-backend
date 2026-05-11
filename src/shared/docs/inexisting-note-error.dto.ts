import { ApiProperty } from '@nestjs/swagger';

export class InexistingNoteResponseDto {
    @ApiProperty({ example: 'Essa nota não existe.' })
    message: string;

    @ApiProperty({ example: 401 })
    statusCode: number;
}