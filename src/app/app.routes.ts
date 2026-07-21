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
import { OwnerNavbarComponent } from '../components/owner-navbar/owner-navbar.component';
import { AddFlatComponent } from '../components/add-flat/add-flat.component';
import { ManagementComponent } from '../components/management/management.component';
import { PolicyComponentComponent } from '../components/policy-component/policy-component.component';
import { ComingSoonPageComponent } from '../components/coming-soon-page/coming-soon-page.component';
import { TermsOfServiceComponent } from '../components/terms-of-service/terms-of-service.component';
import { AddUserComponent } from '../components/add-user/add-user.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { RoleGuard } from '../RoleGuard';
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
    {
        path: 'pg/:id',
        component: PgDetailComponent,
        data: { ssr: false }
    },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'owner-navbar', component: OwnerNavbarComponent },
    { path: 'ownerpage', component: OwnerpageComponent, canActivate: [RoleGuard], data: { roles: ['OWNER'] }, runGuardsAndResolvers: 'always' },
    { path: 'addpglist', component: ListPropertyComponent },
    { path: 'owner/add-tenant', component: AddTenantComponent },
    { path: 'owner/tenants', component: TenantListComponent },
    { path: 'owner/rent-sheet', component: RentSheetComponent },
    { path: 'owner/add-flat', component: AddFlatComponent },
    { path: 'listproperty', redirectTo: '/addpglist', pathMatch: 'full' },
    { path: 'listings/flats', redirectTo: '/listings', pathMatch: 'full' },
    { path: 'listings/duplexes', redirectTo: '/listings', pathMatch: 'full' },
    { path: 'listings/pgs', redirectTo: '/listings', pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent },
    { path: 'owner/profile', redirectTo: '/ownerpage', pathMatch: 'full' },
    { path: 'careers', redirectTo: '/about', pathMatch: 'full' },
    { path: 'press', redirectTo: '/about', pathMatch: 'full' },
    { path: 'blog', redirectTo: '/about', pathMatch: 'full' },
    { path: 'trust-safety', redirectTo: '/about', pathMatch: 'full' },
    { path: 'privacy-policy', component: PolicyComponentComponent },
    { path: 'terms-of-service', component: PolicyComponentComponent },
    { path: 'cookie-policy', component: PolicyComponentComponent },
    { path: 'management', component: ManagementComponent , canActivate: [RoleGuard], data: { roles: ['MANAGEMENT'] }, runGuardsAndResolvers: 'always' },
    { path: 'comingsoonpage', component: ComingSoonPageComponent },
    { path: 'termsandservices', component: TermsOfServiceComponent },
    { path: 'management/add-user', component: AddUserComponent }


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule, HttpClientModule]

})
export class AppRoutingModule { }