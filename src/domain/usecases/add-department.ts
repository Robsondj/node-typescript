import { type DepartmentModel } from '../models/department'

export interface AddDepartmentModel {
  name: string
}

export interface AddDepartment {
  add: (department: AddDepartmentModel) => Promise<DepartmentModel>
}
