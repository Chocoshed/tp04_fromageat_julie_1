import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PollutionFilters {
  types: string[];
  dateDebut?: string;
  dateFin?: string;
  statut: 'toutes' | 'miennes' | 'favoris';
}

@Component({
  selector: 'app-pollution-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pollution-filters.html',
  styleUrls: ['./pollution-filters.css']
})
export class PollutionFiltersComponent {
  @Output() filtersChange = new EventEmitter<PollutionFilters>();
  
  availableTypes = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];
  
  selectedTypes: string[] = [...this.availableTypes];
  dateDebut = '';
  dateFin = '';
  statut: 'toutes' | 'miennes' | 'favoris' = 'toutes';
  
  isExpanded = false;
  
  toggleType(type: string) {
    const index = this.selectedTypes.indexOf(type);
    if (index > -1) {
      this.selectedTypes.splice(index, 1);
    } else {
      this.selectedTypes.push(type);
    }
    this.emitFilters();
  }
  
  onDateChange() {
    this.emitFilters();
  }
  
  onStatutChange() {
    this.emitFilters();
  }
  
  resetFilters() {
    this.selectedTypes = [...this.availableTypes];
    this.dateDebut = '';
    this.dateFin = '';
    this.statut = 'toutes';
    this.emitFilters();
  }
  
  private emitFilters() {
    this.filtersChange.emit({
      types: this.selectedTypes,
      dateDebut: this.dateDebut || undefined,
      dateFin: this.dateFin || undefined,
      statut: this.statut
    });
  }
  
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
