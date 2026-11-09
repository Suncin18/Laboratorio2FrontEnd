import { Component, OnInit, signal } from "@angular/core";
import { Category } from "../interfaces/category.interface";
import { CategoryService } from "../services/category.service";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth";

@Component({
    selector: 'app-categories',
    imports: [FormsModule],
    templateUrl: './categories.html',
    styleUrl: './categories.css'
})
export class categories implements OnInit {
    categoryList = signal<Category[]>([]);

    isLoading = signal(true);
    errorMessage = signal('');

    isFormVisible = signal(false);
    editingCategoryId: number | null = null;

    formErrorMessage = signal('');
    successMessage = signal('');

    categoryForm: Omit<Category, 'id'> = {
        name: '',
        description: '',
        products: []
    };

    constructor(private categoryService: CategoryService, public authService: AuthService) {}

    ngOnInit(): void {
        this.getCategories();
    }

    async getCategories(): Promise<void> {
        try{
            this.categoryList.set(await this.categoryService.getCategories());
        } catch (error) {
            if (error instanceof TypeError){
                this.errorMessage.set('No se pudo conectar con el servidor.');
            } else {
                this.errorMessage.set(error instanceof Error 
                    ? error.message : 'Ocurrió un error inesperado.');
            }
        } finally {
            this.isLoading.set(false);
        }
    }

    openCreateForm(): void {
        this.editingCategoryId = null;
        this.formErrorMessage.set('');
        this.successMessage.set('');

        this.categoryForm = {
            name: '',
            description: '',
            products: []
        };

        this.isFormVisible.set(true);
    }

    openEditForm(category: Category): void {
        this.editingCategoryId = category.id;
        this.formErrorMessage.set('');
        this.successMessage.set('');

        this.categoryForm = {
            name: category.name,
            description: category.description,
            products: category.products
        };

        this.isFormVisible.set(true);
    }

    async saveCategory(): Promise<void> {
        this.formErrorMessage.set('');
        this.successMessage.set('');

        try{
            if(this.editingCategoryId === null){
                await this.categoryService.createCategory(this.categoryForm);
                this.successMessage.set('Categoría registrada correctamente.');
            }else{
                await this.categoryService.updateCategory(
                    this.editingCategoryId,
                    this.categoryForm
                );
                this.successMessage.set('Categoría actualizada correctamente');
            }

            this.isFormVisible.set(false);
            await this.getCategories();
        } catch(error){
            this.formErrorMessage.set(error instanceof Error 
                ? error.message : "No se pudo guardar la categoría.");
        }
    }

    async deleteCategory(id: number): Promise<void>{
        if(!confirm('¿Está seguro de que desea eliminar esta categoría?')){
            return;
        }

        try{
            await this.categoryService.deleteCategory(id);
            this.successMessage.set('Categoría eliminada correctamente.');
            await this.getCategories();
        } catch(error){
            if(error instanceof Error && error.message.includes('409')){
                this.errorMessage.set(
                    'No se puede eliminar esta categoría porque tiene productos asociados');
            }else {
                this.errorMessage.set(error instanceof Error 
                ? error.message : 'No se pudo eliminar la categoría.');
            }
        }
    }

    cancelForm(): void {
        this.isFormVisible.set(false);
        this.formErrorMessage.set('');
    }
}