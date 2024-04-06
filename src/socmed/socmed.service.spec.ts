import { Test, TestingModule } from '@nestjs/testing';
import { SocmedService } from './socmed.service';

describe('SocmedService', () => {
  let service: SocmedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocmedService],
    }).compile();

    service = module.get<SocmedService>(SocmedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
