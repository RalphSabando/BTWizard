import { Injectable } from '@angular/core';
import { API_ROUTES } from 'src/app/constants/api-routes.enum';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  units$ = this.request.get(API_ROUTES.UNITS);

  constructor(private request: RequestService) { }
  
}
