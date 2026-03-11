import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, EstadoUsuario } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Busca por correo (usado por AuthService para login)
  async findByEmail(correo: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { correo } });
  }

  // Busca por ID (usado por JWT strategy)
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { idUsuario: id } });
  }

  // Guarda un usuario (usado por AuthService para registro)
  async save(user: Partial<User>): Promise<User> {
    const nuevo = this.userRepository.create(user);
    return this.userRepository.save(nuevo);
  }

  // RF-08: Admin bloquea el acceso de un usuario específico
  async blockUser(id: number): Promise<User> {
    const usuario = await this.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    usuario.estado = EstadoUsuario.BLOQUEADO;
    return this.userRepository.save(usuario);
  }

  // Lista todos los usuarios (solo para Admin)
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
