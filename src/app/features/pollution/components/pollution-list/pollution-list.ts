import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PollutionService } from '../../../../core/services/pollution.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pollution-list',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css'
})
export class PollutionList {
  service = inject(PollutionService);

}
