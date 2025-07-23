"use strict";
exports.id = 192;
exports.ids = [192];
exports.modules = {

/***/ 192:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const useCurrentPlayer = ()=>{
    const isBrowser = (()=>"undefined" !== 'undefined'
    )();
    const getPlayer = ()=>{
        const localUid = isBrowser ? window['localStorage']['uid'] : '';
        let data = {
            uid: localUid,
            username: '',
            sid: ''
        };
        const rawData = isBrowser ? window['sessionStorage']['player'] : '';
        if (rawData) {
            data = {
                ...data,
                ...JSON.parse(rawData)
            };
        }
        return data;
    };
    const setPlayer = (data)=>{
        if (isBrowser) {
            window['sessionStorage'].setItem('player', JSON.stringify(data));
        }
        return data;
    };
    const updatePlayer = (field, value)=>{
        const player = getPlayer();
        return setPlayer({
            ...player,
            [`${field}`]: value
        });
    };
    const setError = (message)=>{
        if (isBrowser) {
            window['sessionStorage'].setItem('error', message);
        }
    };
    const getError = ()=>{
        return isBrowser ? window['sessionStorage']['error'] : '';
    };
    return {
        getPlayer,
        setPlayer,
        updatePlayer,
        setError,
        getError
    };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useCurrentPlayer);


/***/ })

};
;