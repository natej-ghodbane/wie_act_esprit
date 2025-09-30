import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll(filters?: FilterQuery<ProductDocument>) {
    const query = filters ? { ...filters } : {};
    return this.productModel.find(query).lean();
  }

  async findById(id: string) {
    return this.productModel.findById(id).lean();
  }

  async create(createProductDto: any) {
    const product = new this.productModel(createProductDto);
    return product.save();
  }
}


