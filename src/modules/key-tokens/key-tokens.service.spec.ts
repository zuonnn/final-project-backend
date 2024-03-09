import { Test, TestingModule } from '@nestjs/testing';
import { KeyTokensService } from './key-tokens.service';

describe('KeyTokensService', () => {
  let service: KeyTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyTokensService],
    }).compile();

    service = module.get<KeyTokensService>(KeyTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
