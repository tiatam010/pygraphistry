import { getHandler } from 'viz-shared/routes';

export function session(path, base) {
    return function session({ loadViewsById }) {

        const getValues = getHandler(path, loadViewsById);

        return [{
            get: getValues,
            route: `${base}['session']['status', 'message', 'progress']`
        }];
    }
}