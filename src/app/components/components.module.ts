import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContentViewComponent } from './content-view/content-view.component';
import { MapViewComponent } from './map-view/map-view.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableViewComponent } from './table-view/table-view.component';
import { RangeViewComponent } from './range-view/range-view.component';
import { Select2Module } from 'ng-select2-component';
@NgModule({
	declarations: [
        ContentViewComponent,
        MapViewComponent,
        TableViewComponent,
        RangeViewComponent
    ],
	imports: [
        CommonModule, 
        IonicModule,
        LeafletModule,
        PipesModule,
        ReactiveFormsModule,
        FormsModule,
        Select2Module
    ],
	exports: [
        ContentViewComponent,
        MapViewComponent,
        TableViewComponent,
        RangeViewComponent
    ],
    entryComponents: [],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}
