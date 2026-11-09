import { Injectable, signal } from "@angular/core";
import { LoginResponse } from "../interfaces/login-response.interface";
import { LoginRequest } from "../interfaces/login-request.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly url = "http://localhost:8080/api/v1/auth/login";
    private readonly roles = signal<string[]>([]);
    
    authenticated = signal(this.getAccessToken() !== null);

    constructor(){
        const token = this.getAccessToken();

        if(token){
            this.loadRoles(token);
        }
    }

    async login(username: string, password: string): Promise<LoginResponse> {
        const request: LoginRequest = { username, password };

        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if(!response.ok){
            if(response.status === 401){
                throw new Error("Uusario o contraseña incorrectos.");
            }

            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data: LoginResponse = await response.json();

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        this.authenticated.set(true);
        this.loadRoles(data.access_token);

        return data;
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        this.authenticated.set(false);
        this.roles.set([]);
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getAuthHeaders(): Record<string, string> {
        const token = this.getAccessToken();

        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private loadRoles(token: string): void {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const roles: string[] = payload.realm_access?.roles ?? [];

            this.roles.set(roles);
        } catch {
            this.roles.set([]);
        }
    }

    hasRole(role: string): boolean {
        return this.roles().includes(role);
    }

    isSuperAdmin(): boolean {
        return this.hasRole('SUPER-ADMIN-ROLE');
    }

    getRoles(): string[] {
        return this.roles();
    }
}