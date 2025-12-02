import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Routes, provideRouter } from '@angular/router';
import { InventoryManagementComponent } from './app/inventory-management/inventory-management.component';

const routes: Routes = [];

bootstrapApplication(InventoryManagementComponent, {
providers: [provideAnimationsAsync(), provideRouter(routes)],
}).catch((err) => console.error(err));