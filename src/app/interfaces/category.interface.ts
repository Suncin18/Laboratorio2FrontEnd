import { ProductSummary } from './product.interface';

export interface Category {
    id: number;
    name: string;
    description: string;
    products: ProductSummary[];
}

export interface CategorySummary {
    id: number;
    name: string;
    description: string;
}