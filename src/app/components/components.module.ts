import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContentViewComponent } from './content-view/content-view.component';
import { MapViewComponent } from './map-view/map-view.component';

@NgModule({
	declarations: [
        ContentViewComponent,
        MapViewComponent
    ],
	imports: [
        CommonModule, IonicModule
    ],
	exports: [
        ContentViewComponent,
        MapViewComponent
    ],
    entryComponents: [],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}
