import { type DepartmentModel } from '../../../domain/models/department'
import { type AddDepartmentModel } from '../../../domain/usecases/add-department'

export interface AddDepartmentRepository {
  add: (department: AddDepartmentModel) => Promise<DepartmentModel>
}
