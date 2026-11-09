import { CategorySummary } from './category.interface';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: CategorySummary;
}

export interface ProductSummary {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
}