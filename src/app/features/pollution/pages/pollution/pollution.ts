import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Pollution } from '../../../../core/models/pollution.model';

@Component({
  selector: 'app-pollution',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './pollution.html',
})
export class PollutionComponent {
  selectedPollution?: Pollution;

  constructor(private router: Router) {}

  onPollutionSubmitted(p: Pollution) {
    this.selectedPollution = p;
  }

  onNewDeclaration() {
    this.selectedPollution = undefined;
  }

  onViewList() {
    // Navigation vers la liste des pollutions si la route existe
    this.router.navigate(['/pollutions']);
  }
}
