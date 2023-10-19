import { Test, TestingModule } from '@nestjs/testing'
import { JobsTagController } from './job.controller'

describe('JobController', () => {
  let controller: JobsTagController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsTagController],
    }).compile()

    controller = module.get<JobsTagController>(JobsTagController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
