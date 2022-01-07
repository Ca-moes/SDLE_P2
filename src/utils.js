export function getUserPubKey(gun, alias) {
    let key = '';
    
    gun.get('users/'+alias, (ack) => {
        console.log(ack);
        key = ack.put.pubKey;
    });
    
    
    return key;
}

export function getOwnPubKey(gun) {
    return '~' + gun.user().is.pub;
}