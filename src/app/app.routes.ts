import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '../components/account/account.component';
import { LoginComponent } from '../components/login/login.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HomepageComponent } from '../components/homepage/homepage.component';
import { OwnerpageComponent } from '../components/ownerpage/ownerpage.component';
import { AddpgComponent } from '../components/addpg/addpg.component';
import { AboutComponent } from '../components/about/about.component';
import { ContactComponent } from '../components/contact/contact.component';
import { ServicesComponent } from '../components/services/services.component';
import { OwnerloginComponent } from '../components/ownerlogin/ownerlogin.component';
import { ListPropertyComponent } from '../components/list-property/list-property.component';
import { PgListingsComponent } from '../components/pg-listings/pg-listings.component';
import { PgDetailComponent } from '../components/pg-detail/pg-detail.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { TenantListComponent } from '../components/tenant-list/tenant-list.component';
import { AddTenantComponent } from '../components/add-tenant/add-tenant.component';
import { RentSheetComponent } from '../components/rent-sheet/rent-sheet.component';
import { OwnerGuard } from '../OwnerGuard';
import { OwnerNavbarComponent } from '../components/owner-navbar/owner-navbar.component';
// import { Navbar2Component } from '../components/navbar2/navbar2.component';

export const routes: Routes = [
    { path: '', redirectTo: '/homepage', pathMatch: 'full' },
    { path: 'account', component: AccountComponent },
    { path: 'login', component: LoginComponent },
    { path: 'navbar', component: NavbarComponent },
    { path: 'footer', component: FooterComponent },
    { path: 'homepage', component: HomepageComponent },
    { path: 'addpg', component: AddpgComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'service', component: ServicesComponent },
    { path: 'owner', component: OwnerloginComponent },
    { path: 'listings', component: PgListingsComponent },
    { path: 'pg/:id', component: PgDetailComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    // { path: 'tenantlist', component: TenantListComponent },
    // { path: 'addtenant', component: AddTenantComponent },
    // { path: 'rentsheet', component: RentSheetComponent },
    { path: 'owner-navbar', component: OwnerNavbarComponent },
    { path: 'ownerpage', component: OwnerpageComponent, canActivate: [OwnerGuard] },
    { path: 'addpglist', component: ListPropertyComponent, canActivate: [OwnerGuard] },
    { path: 'owner/add-tenant', component: AddTenantComponent, canActivate: [OwnerGuard] },
    { path: 'owner/tenants', component: TenantListComponent, canActivate: [OwnerGuard] },
    { path: 'owner/rent-sheet', component: RentSheetComponent, canActivate: [OwnerGuard] },


    // {path: 'navbar2', component: Navbar2Component},

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule, HttpClientModule]

})
export class AppRoutingModule { }