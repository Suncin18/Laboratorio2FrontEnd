import { Component, OnInit, signal } from "@angular/core";
import { UserService } from "../../services/user.service";
import { User } from "../../interfaces/user.interface";

@Component({
    selector: 'app-users',
    imports: [],
    templateUrl: './users.html',
    styleUrl: './users.css'
})
export class Users implements OnInit{
    userList = signal<User[]>([]);
    isLoading = signal(true);
    errorMessage = signal('');

    constructor(private userService: UserService){}

    ngOnInit(): void {
        this.getUsers();
    }

    async getUsers(): Promise<void>{
        try{
            this.userList.set(await this.userService.getUsers());
        } catch(error){
            if(error){
                if(error instanceof TypeError){
                    this.errorMessage.set('No se pudo conectar con el servidor.');
                }else{
                    this.errorMessage.set(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
                }
            }
        } finally{
            this.isLoading.set(false);
        }
    }
}