import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavbarComponent,
    FooterComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  constructor(private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.setPage(
      'About Crib - Your Trusted PG Finder',
      'Learn about Crib, the leading PG marketplace in India. Find verified accommodation with direct owner contact and no broker fees.',
      '',
      'https://cribup.vercel.app/about'
    );
  }
}
