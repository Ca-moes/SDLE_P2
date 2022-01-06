export function getUserPubKey(gun, alias) {
    let key = '';
    
    gun.get('~@'+alias).on((data) => {
        key = Object.values(data).map((item) => {
            const val = Object.values(item);
            return val.length === 1 ? val[0] : '';
          }).filter((item) => item !== '')[0];
    });
    gun.get('~@'+alias).off();
    
    return key;
}

export function getOwnPubKey(gun) {
    return '~' + gun.user().is.pub;
}