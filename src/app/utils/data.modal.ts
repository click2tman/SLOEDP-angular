export interface NationGeo {
    type: string,
    crs: {
        type: string,
        properties: {
            name: string
        }
    },
    features: [
        {
            type: string,
            properties: {
                Name: string,
                description: string
                timestamp: any
                begin: string
                end: any,
                altitudeMode: any,
                tessellate: number,
                extrude: number,
                visibility: number,
                drawOrder: any
                icon: string
            },
            geometry: {
                type: string,
                coordinates: []
            }
        }
    ],
}