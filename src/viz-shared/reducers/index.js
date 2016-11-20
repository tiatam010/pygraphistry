export * from './toolbar';
export * from './settings';
export * from './histograms';
export * from './expressions';
export * from './encodings';
export * from './inspector';

export default function rootReducer(state, action) {
    if (action.type === 'falcor-react-redux/update') {
        return action.data;
    }
    return state;
}
