import { Injectable } from "@angular/core";
import { Product } from "../interfaces/product.interface";
import { AuthService } from "./auth";

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    readonly url = "http://localhost:8080/api/v1/product";

    constructor(private readonly authService: AuthService) {}

    async getProducts(): Promise<Product[]> {
        const response = await fetch(this.url, {
            method: 'GET',
            headers: this.authService.getAuthHeaders()
        });

        if (!response.ok){
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) ?? [];
    }

    async createProduct(product: Omit<Product, 'id'>): Promise<Product>{
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.authService.getAuthHeaders()
            },
            body: JSON.stringify(product)
        });

        if(!response.ok){
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    async updateProduct(id: number, product: Omit<Product, 'id'>): Promise<Product>{
        const response = await fetch(`${this.url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.authService.getAuthHeaders()
            },
            body: JSON.stringify(product)
        });

        if(!response.ok){
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    async deleteProduct(id: number): Promise<void>{
        const response = await fetch(`${this.url}/${id}`, {
            method: 'DELETE',
            headers: {
                ...this.authService.getAuthHeaders()
            }
        });

        if(!response.ok){
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
    }
}