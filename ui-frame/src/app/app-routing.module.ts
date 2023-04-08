import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {RecordingComponent} from './component/recording/recording.component';
import {HomeComponent} from './component/home/home.component';
import {CountdownComponent} from './component/countdown/countdown.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'recording', component: RecordingComponent},
  {path: 'countdown', component: CountdownComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
