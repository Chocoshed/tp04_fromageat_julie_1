import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pollution } from '../../../../core/models/pollution.model';

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.css'
})
export class PollutionRecap {
  @Input() pollution?: Pollution;
  @Output() newDeclaration = new EventEmitter<void>();
  @Output() viewList = new EventEmitter<void>();

  onNewDeclaration() {
    this.newDeclaration.emit();
  }

  onViewList() {
    this.viewList.emit();
  }
}
