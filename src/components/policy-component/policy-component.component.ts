import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-policy-component',
  standalone: true,
  imports: [],
  templateUrl: './policy-component.component.html',
  styleUrl: './policy-component.component.css'
})
export class PolicyComponentComponent implements OnInit {
  constructor(private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.setPage(
      'Privacy Policy — CribUp | Data Protection',
      'Read CribUp privacy policy. Learn how we collect, use, and protect your personal data.',
      '',
      'https://cribup.vercel.app/privacy-policy'
    );
  }
