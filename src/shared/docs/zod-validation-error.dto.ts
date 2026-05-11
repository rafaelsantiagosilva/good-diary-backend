import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ZodValidationErrorDetail {
    @ApiProperty({ example: 'too_small', description: 'Código interno do erro no Zod' })
    code: string;

    @ApiProperty({ example: 'Uma nota deve conter título', description: 'Mensagem amigável' })
    message: string;

    @ApiProperty({ example: ['title'], description: 'Caminho do campo com erro' })
    path: (string | number)[];

    @ApiPropertyOptional({ example: 'body', description: 'Origem da validação' })
    origin?: string;

    @ApiPropertyOptional({ example: 'string' })
    type?: string;

    @ApiPropertyOptional({ example: 1 })
    minimum?: number;

    @ApiPropertyOptional({ example: 100 })
    maximum?: number;

    @ApiPropertyOptional({ example: true })
    inclusive?: boolean;

    @ApiPropertyOptional({ example: 'string' })
    expected?: string;

    @ApiPropertyOptional({ example: 'undefined' })
    received?: string;
}

export class ZodValidationErrorResponseDto {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: 'Validation failed' })
    message: string;

    @ApiProperty({ type: [ZodValidationErrorDetail] })
    errors: ZodValidationErrorDetail[];
}