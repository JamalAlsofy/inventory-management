import { Injectable } from '@angular/core';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@domain/localstorage/storge.util';
@Injectable({ providedIn: 'root' })

export class commonService {
 

     saveUIState(state: any) {
    saveToStorage(STORAGE_KEYS.UI_STATE, state);
  }
  loadUIState(): any {
    return loadFromStorage<any>(STORAGE_KEYS.UI_STATE);
  }
  saveTheme(theme: 'dark'|'light') {
    saveToStorage(STORAGE_KEYS.THEME, theme);
  }
  loadTheme(): 'dark'|'light' {
    const t = loadFromStorage<string>(STORAGE_KEYS.THEME);
    return (t === 'dark' ? 'dark' : 'light');
  }
}