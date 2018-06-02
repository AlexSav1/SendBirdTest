import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from './services/auth.service';
import { AdminService } from './services/admin.service';

import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ArtistComponent } from './components/artist/artist.component';
import { EventComponent } from './components/event/event.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MembershipComponent } from './components/membership/membership.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminEventsComponent } from './components/admin-events/admin-events.component';
import { AdminEventFormComponent } from './components/admin-event-form/admin-event-form.component';
import { AdminArtistsComponent } from './components/admin-artists/admin-artists.component';
import { AdminArtistFormComponent } from './components/admin-artist-form/admin-artist-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './components/about/about.component';
import { StoreComponent } from './components/store/store.component';
import { PurchasePlanComponent } from './components/purchase-plan/purchase-plan.component';
import { EditArtistComponent } from './components/edit-artist/edit-artist.component';
import { AdminPollsComponent } from './components/admin-polls/admin-polls.component';
import { AdminPollFormComponent } from './components/admin-poll-form/admin-poll-form.component';
import { ForumComponent } from './components/forum/forum.component';
import { SingleThreadComponent } from './components/single-thread/single-thread.component';


const appRoutes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'events', component: EventListComponent},
  {path: 'artists', component: ArtistListComponent},
  {path: 'artist/:id', component: ArtistComponent},
  {path: 'event/:id', component: EventComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'edit', component: EditArtistComponent},
  {path: 'about', component: AboutComponent},
  {path: 'store', component: StoreComponent},
  {path: 'plan', component: PurchasePlanComponent},
  {path: 'forum', component: ForumComponent},
  {path: 'forum/:url', component: SingleThreadComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'admin/events', component: AdminEventsComponent},
  {path: 'admin/artists', component: AdminArtistsComponent},
  {path: 'admin/polls', component: AdminPollsComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    EventListComponent,
    ArtistListComponent,
    NavBarComponent,
    ArtistComponent,
    EventComponent,
    DashboardComponent,
    MembershipComponent,
    AdminComponent,
    AdminEventsComponent,
    AdminEventFormComponent,
    AdminArtistsComponent,
    AdminArtistFormComponent,
    FooterComponent,
    AboutComponent,
    StoreComponent,
    PurchasePlanComponent,
    EditArtistComponent,
    AdminPollsComponent,
    AdminPollFormComponent,
    ForumComponent,
    SingleThreadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    FormsModule
  ],
  providers: [AuthService, AdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }
