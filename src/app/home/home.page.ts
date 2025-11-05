import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor() {}

  openAboutModal() {
    const modalElement = document.getElementById('about-app-modal');
    
    if (modalElement) {
      modalElement.classList.add('is-open');
    }
  }

}
