import { Injectable } from "@angular/core";
import { Category } from "../interfaces/category.interface";
import { AuthService } from "./auth";

@Injectable({
    providedIn: 'root'
})

export class CategoryService {
    private readonly url = "http://localhost:8080/api/v1/category";

    constructor(private readonly authService: AuthService) {}

    async getCategories(): Promise<Category[]> {
        const response = await fetch(this.url, {
            method: 'GET',
            headers: this.authService.getAuthHeaders()
        });

        if (!response.ok){
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) ?? [];
    }

    async createCategory(category: Omit<Category, 'id'>): Promise<Category>{
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.authService.getAuthHeaders()
            },
            body: JSON.stringify(category)
        });

        if(!response.ok){
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }
    
    async updateCategory(id: number, category: Omit<Category, 'id'>): Promise<Category>{
        const response = await fetch(`${this.url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.authService.getAuthHeaders()
            },
            body: JSON.stringify(category)
        });

        if(!response.ok){
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    async deleteCategory(id: number): Promise<void>{
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