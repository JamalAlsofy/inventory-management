import { Component, OnInit } from '@angular/core';
import { ImportsModule } from './imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '@domain/models/product';
import { productService } from '@service/productservice';
import { FormControl } from '@angular/forms';
import { commonService } from '@service/commonservice';
import { debounceTime } from 'rxjs';
import { AddEditProductComponent } from './inventory-management/add-edit-product/add-edit-product.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'table-products',
  templateUrl: 'table-products-demo.html',
  standalone: true,
  imports: [ImportsModule],
  providers: [
    MessageService,
    ConfirmationService,
    productService,
    commonService,
    DialogService
  ],
  styles: [
    `:host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
  ]
})
export class TableProductsDemo implements OnInit {

  products: Product[] = [];
  displayed: Product[] = [];
  selectedProducts: Product[] | null = [];

  search = new FormControl('');
  categoryFilter = new FormControl('all');

  sortBy = { key: 'name' as 'name' | 'price' | 'quantity', dir: 'asc' as 'asc' | 'desc' };

  page = 0;
  pageSize = 8;

  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Furniture' },
    { id: 3, name: "Children's Toys" },
    { id: 4, name: 'Office Tools' }
  ];

  constructor(
    private productsService: productService,
    private uiService: commonService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.restoreUIState();
    this.subscribeToProductList();
    this.attachFilterListeners();
  }

  private restoreUIState(): void {
    const ui = this.uiService.loadUIState();
    if (!ui) return;

    this.search.setValue(ui.search ?? '');
    this.categoryFilter.setValue(ui.category ?? 'all');
    this.page = ui.page ?? 0;
    this.pageSize = ui.pageSize ?? 8;
    this.sortBy = ui.sortBy ?? this.sortBy;
  }

  private subscribeToProductList(): void {
    this.productsService.products.subscribe(list => {
      this.products = [...list];
      this.applyFilters();
    });
  }

  private attachFilterListeners(): void {
    this.search.valueChanges.pipe(debounceTime(200)).subscribe(() => this.applyFilters());
    this.categoryFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  private applyFilters(): void {
    let filtered = [...this.products];

    const keyword = (this.search.value || '').toLowerCase();
    if (keyword) filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword));

    const category = this.categoryFilter.value;
    if (category !== 'all') filtered = filtered.filter(p => p.categoryId === +category);

    filtered = this.applySorting(filtered);
    this.displayed = this.applyPagination(filtered);

    this.saveUIState();
  }

  private applySorting(list: Product[]): Product[] {
    return list.sort((a, b) => {
      const aValue = this.sortBy.key === 'name' ? a.name : this.sortBy.key === 'price' ? a.price : a.quantity;
      const bValue = this.sortBy.key === 'name' ? b.name : this.sortBy.key === 'price' ? b.price : b.quantity;

      if (aValue < bValue) return this.sortBy.dir === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortBy.dir === 'asc' ? 1 : -1;

      return 0;
    });
  }

  private applyPagination(list: Product[]): Product[] {
    const start = this.page * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  private saveUIState(): void {
    this.uiService.saveUIState({
      search: this.search.value,
      category: this.categoryFilter.value,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy
    });
  }

  changeSort(key: 'name' | 'price' | 'quantity'): void {
    if (this.sortBy.key === key) {
      this.sortBy.dir = this.sortBy.dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = { key, dir: 'asc' };
    }
    this.applyFilters();
  }

  goPage(p: number): void {
    this.page = p;
    this.applyFilters();
  }

  openForm(event: any): void {
    const isEdit = !!event?.id;

    const ref = this.dialog.open(AddEditProductComponent, {
      header: isEdit ? 'Edit Product' : 'Add Product',
      width: '40%',
      styleClass: 'my-dialog',
      data: { editMode: isEdit, id: event.item?.id }
    });

    ref.onClose.subscribe(result => {
      if (result != null) this.handleSaved();
    });
  }

  private handleSaved(): void {
    this.applyFilters();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Record saved successfully'
    });
  }

  deleteSelectedProducts(): void {
    this.confirmation.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const selectedIds = this.selectedProducts?.map(p => p.id) || [];
        this.products = this.products.filter(p => !selectedIds.includes(p.id));
        this.selectedProducts = null;

        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Products Deleted'
        });
      }
    });
  }

  deleteProduct(product: Product): void {
    this.confirmation.confirm({
      message: `Are you sure you want to delete ${product.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.remove(product.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Product Deleted'
        });
      }
    });
  }
}
