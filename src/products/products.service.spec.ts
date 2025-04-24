import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test product description',
      };

      const mockProduct: Product = {
        id: '1',
        ...createProductDto,
        stock: 0,
      };

      mockProductRepository.create.mockReturnValue(mockProduct);
      mockProductRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(mockProductRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockProductRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 99.99,
          description: 'Description 1',
          stock: 10,
        },
        {
          id: '2',
          name: 'Product 2',
          price: 199.99,
          description: 'Description 2',
          stock: 5,
        },
      ];

      mockProductRepository.find.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(mockProductRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Test Product',
        price: 99.99,
        description: 'Test product description',
        stock: 10,
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findById('1');

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockProduct);
    });

    it('should return null when product is not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      const result = await service.findById('non-existent-id');

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 'non-existent-id' } });
      expect(result).toBeNull();
    });
  });
}); 