import { type DepartmentModel } from '../../../domain/models/department'
import { type AddDepartment, type AddDepartmentModel } from '../../../domain/usecases/add-department'
import { type AddDepartmentRepository } from '../../interfaces/db/add-department-repository'

export class DbAddDepartment implements AddDepartment {
  constructor (private readonly addDepartmentRepository: AddDepartmentRepository) {}
  async add (department: AddDepartmentModel): Promise<DepartmentModel> {
    return await this.addDepartmentRepository.add(department)
  }
}
