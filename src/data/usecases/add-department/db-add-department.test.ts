import { type DepartmentModel } from '../../../domain/models/department'
import { type AddDepartmentModel } from '../../../domain/usecases/add-department'
import { type AddDepartmentRepository } from '../../interfaces/db/add-department-repository'
import { DbAddDepartment } from './db-add-department'

const makeDepartmentModel = (): DepartmentModel => {
  return {
    id: 'any_id',
    name: 'any_department'
  }
}

const makeAddDepartmentModel = (): AddDepartmentModel => {
  return {
    name: 'any_department'
  }
}

const makeAddDepartmentRepositoryStub = (): AddDepartmentRepository => {
  class AddDepartmentRepositoryStub implements AddDepartmentRepository {
    async add (department: AddDepartmentModel): Promise<DepartmentModel> {
      return makeDepartmentModel()
    }
  }
  return new AddDepartmentRepositoryStub()
}

interface SutTypes {
  sut: DbAddDepartment
  addDepartmentRepositoryStub: AddDepartmentRepository
}

const makeSut = (): SutTypes => {
  const addDepartmentRepositoryStub = makeAddDepartmentRepositoryStub()
  const sut = new DbAddDepartment(addDepartmentRepositoryStub)
  return {
    sut,
    addDepartmentRepositoryStub
  }
}

describe('DbAddDepartment', () => {
  test('Should call AddDepartmentRepository with corret param', async () => {
    const { sut, addDepartmentRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addDepartmentRepositoryStub, 'add')
    const addDepartmentModel = makeAddDepartmentModel()
    await sut.add(addDepartmentModel)
    expect(addSpy).toHaveBeenCalledWith(addDepartmentModel)
  })

  test('Should throw if AddDepartmentRepository throws', async () => {
    const { sut, addDepartmentRepositoryStub } = makeSut()
    jest.spyOn(addDepartmentRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeAddDepartmentModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should return DepartmentModel on success', async () => {
    const { sut } = makeSut()
    const addDepartmentModel = makeAddDepartmentModel()
    const department = await sut.add(addDepartmentModel)
    expect(department).toEqual(makeDepartmentModel())
  })
})
