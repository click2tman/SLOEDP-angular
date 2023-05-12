export interface NationGeoJSON {
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
                altitudeMode
                tessellate
                extrude
                visibility
                drawOrder
                icon
            }
        }
    ]
}