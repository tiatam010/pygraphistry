import {
    ref as $ref,
    atom as $atom,
    pathValue as $value
} from 'reaxtor-falcor-json-graph';

export function exclusions(workbookId, viewId) {
    const view = `workbooksById['${workbookId}'].viewsById['${viewId}']`;
    return {
        exclusionsById: {},
        exclusions: {
            length: 0,
            id: 'exclusions',
            name: 'Exclusions',
            templates: $ref(`${view}.expressions`),
            controls: [{
                id: 'toggle-exclusions',
                name: 'Exclusions',
                type: 'toggle',
                stateKey: 'left',
                state: $ref(`${view}.panels`),
                value: $atom(undefined),
                values: $atom([$ref(`${view}.exclusions`), $atom(undefined)])
            }]
        }
    }
}