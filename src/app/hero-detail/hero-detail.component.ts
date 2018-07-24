import { Component, OnInit, Input } from '@angular/core';
import {Hero} from '../Hero';
import {ActivatedRoute} from '@angular/router';
import {HeroService} from '../hero.service';
import {FormComponent} from "../form/form.component";
import {MatDialog} from "@angular/material";
import {MessagesComponent} from "../messages/messages.component";
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;
  constructor(private route: ActivatedRoute, private service: HeroService,private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.service.getHeroes().subscribe(heroes => {
        if (heroes.length == 0) return;
        this.hero = this.service.getHeroById(id);
      });
    });
  }
  deleteHero(){
    // delete hero dialog
    let dialogRef = this.dialog.open(MessagesComponent,{
      width: 'auto'
    });
    dialogRef.afterClosed().subscribe(result =>{
        if(result == 'yes')
          this.service.deleteHero(this.hero);
      }
    );
      // this.service.deleteHero(this.hero);
  }
}
