import {Component, OnInit} from '@angular/core';
import {Hero} from '../Models/Hero';
import {MatDialogRef} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {Phone} from '../Models/Phone';
import {Address} from '../Models/Address';
import {FieldService} from '../services/field.service';
import {OrmService} from "../services/orm.service";
import {LanguageService} from "../services/language.service";
import {lang} from "../../resources/lang";

@Component({
  selector: 'app-sign-form',
  templateUrl: './sign-form.component.html',
  styleUrls: ['./sign-form.component.scss']
})
export class SignFormComponent implements OnInit {
  submitted = false;
  hero: Hero;
  phones: Phone[];
  addresses: Address[];
  heroForm: FormGroup;
  phoneForms: FormGroup[];
  addressForms: FormGroup[];
  // function helpers
  constructor(private orm: OrmService, private fieldService: FieldService, private dialogRef: MatDialogRef<any>, private languageService: LanguageService) {
    this.phones = [];
    this.addresses = [];
  }

  initHero() {
    this.hero = new Hero;
    // add address Number
    // add Address
  }

  initHeroForm() {
    this.heroForm = new FormGroup({});
    this.fields.forEach(
      (field) => {
        this.heroForm.addControl(field.key, new FormControl('', field.validators));
      }
    );
  }

  initPhoneForm() {
    this.phoneForms = [];
    this.addToForm(this.phoneForms, this.phoneFields);
  }

  initAddressForm() {
    this.addressForms = [];
    this.addToForm(this.addressForms, this.addressFields);
  }

  ngOnInit() {
    // hero form start
    this.initHero();
    // create the form group
    this.initHeroForm();
    this.initPhoneForm();
    this.initAddressForm();
  }

  save() {
    this.hero.firstName = this.heroForm.value.firstName;
    this.hero.lastName = this.heroForm.value.lastName;
    this.hero.alias = this.heroForm.value.alias;
    this.phoneForms.forEach(
      phoneForm => {
        this.phones.push({
          id: 0,
          parentId: 0,
          number: phoneForm.value.phoneNumber,
          code: phoneForm.value.phoneCode,
          place: phoneForm.value.phonePlace
        });
      }
    );
    this.addressForms.forEach(
      addressForm => {
        this.addresses.push({
          id: 0,
          parentId: 0,
          place: addressForm.value.addressPlace,
          addressLoc: addressForm.value.addressLoc
        });
      }
    );
    //   push new address Number
    this.addHero();
  }
  saveAndClose() {
    this.save();
    this.dialogRef.close();
  }

  addHero() {
    console.log(this.hero);
    this.orm.addHero(this.hero, this.phones, this.addresses);
  }
  getHeroById(id) {
    return this.orm.getHeroById(id);
  }
  getPhoneByParentId(id) {
    return this.orm.getPhoneByParentId(id);
  }
  getAddressByParentId(id) {
    return this.orm.getAddressByParentId(id);
  }

  addToForm(forms, fields) {
    forms.push(new FormGroup({}));
    forms.forEach(
      form => {
        fields.forEach(
          (field) => {
            form.addControl(field.key, new FormControl('', field.validators));
          }
        );
      });
  }

  removeForm(form: any, forms: any[]) {
    forms.splice(forms.indexOf(form), 1);
  }

  // add stuff
  get fields() {
    return this.fieldService.fields;
  }

  get phoneFields() {
    return this.fieldService.phoneFields;
  }

  get addressFields() {
    return this.fieldService.addressFields;
  }

  disableSubmit(): boolean {
    return this.heroForm.invalid || this.formsInvalid(this.phoneForms) || this.formsInvalid(this.addressForms);
  }

  formsInvalid(forms): boolean {
    let bool = false;
    forms.forEach(form => {
        if (form.invalid) bool = true;
      }
    );
    return bool;
  }

  hideAdd(forms): boolean {
    if (this.formsInvalid(forms))
      return true;
    forms.forEach(
      form => {
        if (form.invalid) return true;
      }
    );
    return false;
  }

  hideRemove(forms): boolean {
    if (forms.length == 1)
      return true;
    return false;
  }

  clickAdd(to): void {
    switch (to) {
      case 'phone':
        this.addToForm(this.phoneForms, this.phoneFields);
        break;
      case 'address':
        this.addToForm(this.addressForms, this.addressFields);
        break;
    }
  }

  clickRemove(from, form): void {
    switch (from) {
      case 'phone':
        this.removeForm(form, this.phoneForms);
        break;
      case 'address':
        this.removeForm(form, this.addressForms);
        break;
    }
  }

  get formText() {
    return lang[this.languageService.getLang()].addForm;
  }

  onSubmit() {
    this.submitted = true;
  }
}