import { Injectable } from "@angular/core";
import { AuthService } from "./auth";
import { User } from "../interfaces/user.interface";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly url = "http://localhost:8080/api/v1/users";

    constructor(private authService: AuthService){}

    async getUsers(): Promise<User[]> {
        const response = await fetch(this.url, {
            method: 'GET',
            headers: {
                ...this.authService.getAuthHeaders()
            }
        });

        if(!response.ok){
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) ?? []
    }
}