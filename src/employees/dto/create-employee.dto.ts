import { IsInt, IsPositive } from 'class-validator';

export class CreateEmployeeDto {
  @IsInt()
  @IsPositive()
  userId: number;
}
