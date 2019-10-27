import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerComponent } from './components/trainer/trainer.component';

const routes: Routes = [
  {
    path: 'trainer',
    component: TrainerComponent
  },
  {
    path: 'stats',
    component: TrainerComponent
  },
  {
    path: 'settings',
    component: TrainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
