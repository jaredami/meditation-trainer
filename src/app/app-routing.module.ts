import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { StatsComponent } from './components/stats/stats.component';
import { TrainerComponent } from './components/trainer/trainer.component';

const routes: Routes = [
  {
    path: 'trainer',
    component: TrainerComponent
  },
  {
    path: 'stats',
    component: StatsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
