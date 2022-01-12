import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableConfig } from '../model/table-config.model';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() items: any;
  @Input() tableConfig: TableConfig | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Output() clickedItem = new EventEmitter();
  dataSource:any = [];

  constructor() { }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes.hasOwnProperty('items')) {
        this.dataSource = new MatTableDataSource(changes['items'].currentValue);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
  }
  ngAfterViewInit() {
    this.items!.paginator = this.paginator;
  }

  getColumns(): string[] {
    return this.tableConfig!.headers.map( x => x.key);
  }

  itemClicked(item: any) {
    if(this.tableConfig?.clickableRows) this.clickedItem.emit(item);
  }

}
