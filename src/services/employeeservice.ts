import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../domain/models/employee';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../domain/localstorage/storge.util';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees$ = new BehaviorSubject<Employee[]>([]);
  constructor(private http: HttpClient) {
    this.loadInitial();
  }
  private loadInitial() {
    const fromStorage = loadFromStorage<Employee[]>(STORAGE_KEYS.EMPLOYEES);
    if (fromStorage && fromStorage.length) {
      this.employees$.next(fromStorage);
    } else {
      this.http.get<Employee[]>('../assets/mock/employees.json').subscribe(data => {
        this.employees$.next(data);
        saveToStorage(STORAGE_KEYS.EMPLOYEES, data);
      });
    }
  }
  getAll(): Observable<Employee[]> {
    return this.employees$.asObservable();
  }
  getSnapshot(): Employee[] {
    return this.employees$.getValue();
  }
  findById(id: string): Employee | undefined {
    return this.getSnapshot().find(e => e.id === id);
  }
  add(employeePartial: Omit<Employee, 'id' | 'createdAt'>) {
    const newEmp: Employee = {
      ...employeePartial,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const next = [newEmp, ...this.getSnapshot()];
    this.employees$.next(next);
    saveToStorage(STORAGE_KEYS.EMPLOYEES, next);
    return newEmp;
  }
  update(id: string, changes: Partial<Employee>) {
    const arr = this.getSnapshot().map(e => e.id === id ? { ...e, ...changes } : e);
    this.employees$.next(arr);
    saveToStorage(STORAGE_KEYS.EMPLOYEES, arr);
  }
  remove(id: string) {
    const arr = this.getSnapshot().filter(e => e.id !== id);
    this.employees$.next(arr);
    saveToStorage(STORAGE_KEYS.EMPLOYEES, arr);
  }
  
}
/***
 * 
 */