import { Test, TestingModule } from '@nestjs/testing';
import { SocmedController } from './socmed.controller';

describe('SocmedController', () => {
  let controller: SocmedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocmedController],
    }).compile();

    controller = module.get<SocmedController>(SocmedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
