import { NgModule, Component, ViewChild, AfterViewInit, enableProdMode } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxPivotGridModule,
  DxPivotGridComponent,
  DxChartModule,
  DxChartComponent
} from 'devextreme-angular';
import { PivotDemoService } from './pivot-demo.service';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}


@Component({
  selector: 'app-pivot-grid',
  templateUrl: './pivot-grid.component.html',
  styleUrls: ['./pivot-grid.component.scss'],
  providers: [PivotDemoService, CurrencyPipe]

})
export class PivotGridComponent implements AfterViewInit {
  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;

  pivotGridDataSource: any;


  constructor(service: PivotDemoService, private currencyPipe: CurrencyPipe) {

    this.pivotGridDataSource = {
      fields: [{
        caption: "Region",
        width: 120,
        dataField: "region",
        area: "row",
        sortBySummaryField: "Total"
      }, {
        caption: "City",
        dataField: "city",
        width: 150,
        area: "row"
      }, {
        dataField: "date",
        dataType: "date",
        area: "column"
      }, {
        groupName: "date",
        groupInterval: "month",
        visible: false
      }, {
        caption: "Total",
        dataField: "amount",
        dataType: "number",
        summaryType: "sum",
        format: "currency",
        area: "data"
      }, {
        summaryType: "count",
        area: "data"
      }],
      store: service.getSales()
    }
  }

  ngAfterViewInit() {
    this.pivotGrid.instance.bindChart(this.chart.instance, {
      dataFieldsDisplayMode: "splitPanes",
      alternateDataFields: false
    });
  }

  customizeTooltip(args) {
    const valueText = (args.seriesName.indexOf("Total") != -1) ?
      this.currencyPipe.transform(args.originalValue, "USD", "symbol", "1.0-0") :
      args.originalValue;

    return {
      html: args.seriesName + "<div class='currency'>" + valueText + "</div>"
    };
  }
}

