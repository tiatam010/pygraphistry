import {
    ref as $ref,
    error as $error,
    pathValue as $value
} from 'reaxtor-falcor-json-graph';

import { simpleflake } from 'simpleflakes';
import { getHandler, setHandler, captureErrorStacks } from 'viz-shared/routes';

export function workbooks(path, base) {
    return function workbooks({ loadWorkbooksById }) {

        const workbook = `${base}['workbooksById'][{keys}]`;
        const getValues = getHandler(path.concat('workbook'), loadWorkbooksById);
        const setValues = setHandler(path.concat('workbook'), loadWorkbooksById);

        return [{
            get: getWorkbooksLength,
            route: `${base}['workbooks'].length`,
            returns: `Number`
        }, {
            get: getOpenWorkbookReference,
            route: `${base}['workbooks'].open`,
            returns: `$ref('workbooksById[{workbookId}]')`
        }, {
            get: getValues,
            route: `${workbook}['views'][{keys}]`
        }, {
            get: getValues,
            route: `${workbook}['controls'][{keys}]`
        }, {
            get: getValues,
            set: setValues,
            route: `${workbook}['controls'][{keys}][{keys}]`
        }, {
            call: openWorkbook,
            route: `${workbook}.open`
        }, {
            call: forkWorkbook,
            route: `${workbook}.fork`
        }, {
            call: saveWorkbook,
            route: `${workbook}.save`
        }, {
            call: embedWorkbook,
            route: `${workbook}.embed`
        }];

        function getWorkbooksLength(path) {
            return [
                $value(`workbooks.length`, 1)
            ];
        }

        function getOpenWorkbookReference(path) {

            const { request = {} } = this;
            const { query: options = {} } = request;
            const { workbook: workbookId = simpleflake().toJSON() } = options;
            const workbookIds = [workbookId];

            this.request = request;
            request.query = options;
            options.workbook = workbookId;

            return loadWorkbooksById({
                workbookIds, options
            })
            .map(({ workbook }) => $value(
                `workbooks.open`, $ref(`workbooksById['${workbookId}']`)
            ))
            .catch(captureErrorStacks);
        }

        function openWorkbook(path, args) {
            return [];
        }

        function forkWorkbook(path, args) {
            return [];
        }

        function saveWorkbook(path, args) {
            return [];
        }

        function embedWorkbook(path, args) {
            return [];
        }

    }
}