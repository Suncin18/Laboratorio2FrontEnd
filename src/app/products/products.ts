import { Component, OnInit, signal } from "@angular/core";
import { Product } from "../interfaces/product.interface";
import { ProductService } from "../services/product.service";
import { FormsModule } from "@angular/forms";
import { Category } from "../interfaces/category.interface";
import { CategoryService } from "../services/category.service";
import { AuthService } from "../services/auth";

@Component({
    selector: 'app-products',
    imports: [FormsModule],
    templateUrl: './products.html',
    styleUrl: './products.css'
})
export class Products implements OnInit {

    productList = signal<Product[]>([]);
    categoryList = signal<Category[]>([]);

    isLoading = signal(true);
    errorMessage = signal('');

    isFormVisible = signal(false);
    editingProductId: number | null = null;

    formErrorMessage = signal('');
    successMessage = signal('');
    selectedCategoryId: number = 0;

    productForm: Omit<Product, 'id'> = {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: {
            id: 0,
            name: '',
            description: ''
        }
    };

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        public authService: AuthService) {}

    ngOnInit(): void {
        this.getProducts();
        this.getCategories();
    }

    async getProducts(): Promise<void> {
        try{
            this.productList.set(await this.productService.getProducts());
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

    async getCategories(): Promise<void> {
        try{
            this.categoryList.set(await this.categoryService.getCategories());
        } catch {
            this.categoryList.set([]);
        }
    }

    openCreateForm(): void {
        this.editingProductId = null;
        this.selectedCategoryId = 0;
        this.formErrorMessage.set('');
        this.successMessage.set('');

        this.productForm = {
            name: '',
            description: '',
            price: 0,
            stock: 0,
            category: {
                id: 0,
                name: '',
                description: ''
            }
        }

        this.isFormVisible.set(true);
    }

    openEditForm(product: Product): void {
        this.editingProductId = product.id;
        this.selectedCategoryId = product.category.id;
        this.formErrorMessage.set('');
        this.successMessage.set('');

        this.productForm = {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: { ...product.category }
        }

        this.isFormVisible.set(true);
    }

    async saveProduct(): Promise<void> {
        this.formErrorMessage.set('');
        this.successMessage.set('');

        const selectedCategory = this.categoryList().find(
            category => category.id === this.selectedCategoryId
        );

        if(!selectedCategory){
            this.formErrorMessage.set('Debe seleccionar una categoria.');
            return;
        }

        this.productForm.category = {
            id: selectedCategory.id,
            name: selectedCategory.name,
            description: selectedCategory.description
        }

        try{
            if(this.editingProductId === null){
                await this.productService.createProduct(this.productForm);
                this.successMessage.set('Producto registrado correctamente.');
            }else{
                await this.productService.updateProduct(
                    this.editingProductId,
                    this.productForm
                );
                this.successMessage.set('Producto actualizado correctamente');
            }

            this.isFormVisible.set(false);
            await this.getProducts();
        } catch(error){
            this.formErrorMessage.set(error instanceof Error 
                ? error.message : "No se pudo guardar el producto.");
        }
    }

    async deleteProduct(id: number): Promise<void>{
        if(!confirm('¿Está seguro de que desea eliminar este producto?')){
            return;
        }

        try{
            await this.productService.deleteProduct(id);
            this.successMessage.set('Producto eliminado correctamente.');
            await this.getProducts();
        } catch(error){
            this.errorMessage.set(error instanceof Error 
                ? error.message : 'No se pudo eliminar el producto.');
        }
    }

    cancelForm(): void {
        this.isFormVisible.set(false);
        this.formErrorMessage.set('');
    }
}