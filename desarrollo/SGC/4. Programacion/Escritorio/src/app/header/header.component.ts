import { UpdateService } from './../servicios/update.service';
import { CocheraService } from 'app/servicios/cochera.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/servicios/auth.service";
import { Cochera } from "app/models/cochera.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cochera: Cochera;
  navToggle: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private cocheraService: CocheraService,
              private update: UpdateService) { }

  ngOnInit() {
    this.cochera = this.authService.cochera;
    //console.log(localStorage.key(0));
    this.setCochera();
  }

  setCochera () {
    if(localStorage.key(0) != null) {
      let coch: Cochera = <Cochera>JSON.parse(localStorage.getItem(localStorage.key(0)))
      this.cochera = coch;
    }
  }

  onReload() {
    this.update.onClick();
  }

  onToggleNav() {
    this.navToggle = !this.navToggle;
  }

  onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }

}
