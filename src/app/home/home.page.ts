import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor() {}

  // ✅ NOVO MÉTODO: Função JavaScript para abrir o Modal
  openAboutModal() {
    // 1. Encontra o elemento modal pelo ID
    const modalElement = document.getElementById('about-app-modal');
    
    // 2. Se o elemento existir, adiciona a classe 'is-open'
    if (modalElement) {
      modalElement.classList.add('is-open');
    }
  }

}
