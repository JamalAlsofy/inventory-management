import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../domain/models/product';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@domain/localstorage/storge.util';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class productService {
  private products$ = new BehaviorSubject<Product[]>([]);
    products = this.products$.asObservable();
  constructor(private http: HttpClient) {
    this.loadInitial();
  }
  private loadInitial() {
    const fromStorage = loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCT);
    if (fromStorage && fromStorage.length) {
      this.products$.next(fromStorage);
    } else {
      this.http.get<Product[]>('../assets/mock/products.json').subscribe(data => {
        this.products$.next(data);
        saveToStorage(STORAGE_KEYS.PRODUCT, data);
      });
    }
  }
  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }
  getSnapshot(): Product[] {
    return this.products$.getValue();
  }
  findById(id: number): Product | undefined {
    return this.getSnapshot().find(e => e.id === id);
  }
  add(productPartial: Omit<Product, 'id' | 'createdAt'>) {
    const newPro: Product = {
      ...productPartial,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const next = [newPro, ...this.getSnapshot()];
    this.products$.next(next);
    saveToStorage(STORAGE_KEYS.PRODUCT, next);
    return newPro;
  }
  update(id: number, changes: Partial<Product>) {
    const arr = this.getSnapshot().map(e => e.id === id ? { ...e, ...changes } : e);
    this.products$.next(arr);
    saveToStorage(STORAGE_KEYS.PRODUCT, arr);
  }
  remove(id: number) {
    const next = this.getSnapshot().filter(p => p.id !== id);
    this.products$.next(next);
    saveToStorage(STORAGE_KEYS.PRODUCT, next);
  }
 
}



 