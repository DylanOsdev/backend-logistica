import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: number) {
    // 1. Buscamos si el usuario existe
    const usuario = await this.userRepository.findOneBy({ idUsuario: userId });

    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }

    // 2. Creamos el registro del empleado vinculado a ese usuario
    const nuevoEmpleado = this.employeeRepository.create({
      usuario: usuario,
      disponibilidadReparto: 'Disponible' as any,
    });

    return await this.employeeRepository.save(nuevoEmpleado);
  }

  async findAll() {
    // Usamos 'relations' para que NestJS nos traiga también los datos del usuario
    return await this.employeeRepository.find({ relations: ['usuario'] });
  }
}
