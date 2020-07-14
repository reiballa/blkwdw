import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SpidersComponent } from './spiders/spiders.component';
import { CrawlsComponent } from './crawls/crawls.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'spiders', component: SpidersComponent},
  {path: 'crawls', component: CrawlsComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

