// country.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpDataService } from 'src/app/services/http-data.service';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Country } from 'src/app/models/country';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})

export class CountryComponent implements OnInit {

  @ViewChild('countryForm', { static: false })
  countryForm: NgForm;

  countryData: Country;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'countryName', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  isEditMode = false;

  constructor(private httpDataService: HttpDataService) {
    this.countryData = {} as Country;
  }

  ngOnInit(): void {

    // Initializing Datatable pagination
    this.dataSource.paginator = this.paginator;

    // Fetch All countries on Page load
    this.getAllCountries()
  }

  getAllCountries() {
    this.httpDataService.getList().subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

  editCountry(element) {
    this.countryData = _.cloneDeep(element);
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.countryForm.resetForm();
  }

  deleteCountry(id) {
    this.httpDataService.deleteCountry(id).subscribe((response: any) => {

      // Approach #1 to update datatable data on local itself without fetching new data from server
      this.dataSource.data = this.dataSource.data.filter((o: Country) => {
        return o.id !== id ? o : false;
      })

      // Approach #2 to re-call getAllCountries() to fetch updated data
      this.getAllCountries()
    });
  }

  addCountry() {
    this.httpDataService.addCountry(this.countryData).subscribe((response: any) => {
      this.dataSource.data.push({ ...response })
      this.dataSource.data = this.dataSource.data.map(o => {
        return o;
      })
        // Approach #2 to re-call getAllCountries() to fetch updated data
        this.getAllCountries()
    });
  }

  updateCountry() {
    this.httpDataService.updateById(this.countryData).subscribe((response: any) => {

      // Approach #1 to update datatable data on local itself without fetching new data from server
      this.dataSource.data = this.dataSource.data.map((o: Country) => {
        if (o.id === response.id) {
          o = response;
        }
        return o;
      })

      // Approach #2 to re-call getAllCountries() to fetch updated data
      this.getAllCountries()

      //set isEditMode = false and reset form
      this.cancelEdit()

    });
  }

  onSubmit() {
    if (this.countryForm.form.valid) {
      if (this.isEditMode){
        this.updateCountry()
        this.countryForm.resetForm();
      }
      else{
        this.addCountry();
        this.countryForm.resetForm();
      }
    } 
  }
}