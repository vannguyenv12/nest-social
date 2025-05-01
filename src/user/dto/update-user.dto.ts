import {
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  name: string;
  @IsOptional()
  @MaxLength(30)
  bio: string;
  @IsOptional()
  @IsDateString()
  birthdate: Date;
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;
}
