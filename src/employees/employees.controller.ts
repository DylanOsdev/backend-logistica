import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // Promueve a un usuario existente como empleado
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto.userId);
  }

  // Lista todos los empleados con sus datos de usuario
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }
}
