import { Component } from '@angular/core';
import { ReportService } from '../core/report.service';

@Component({
  selector: 'admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css'],
})
export class AdminReportsComponent {
  selected = 'Show Incomplete';
  options = [
    { value: 'Show Incomplete' },
    { value: 'Show Complete' },
    { value: 'Show All' }
  ];
  constructor(public reportServ: ReportService) { }

  filter(event: any) {
    if (event.which === 13) {
      this.reportServ.filterReports(event.srcElement.value);
    }
  }
  onChange() {
    if (this.selected === 'Show All') {
      this.reportServ.getAllReports();
    }
    else if (this.selected === 'Show Complete') {
      this.reportServ.getCompleteReports();
    }
    else if (this.selected === 'Show Incomplete') {
      this.reportServ.getIncompleteReports();
    }
  }
}

