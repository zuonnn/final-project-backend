import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../../users/enums/role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  roles: Role[];
}
