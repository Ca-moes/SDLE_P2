export async function getUserPubKey(gun, alias) {
    
    gun.get('users/'+alias, (ack) => {
        console.log(ack);
        if (ack.put === undefined) {
            return null;
        } else {
            return ack.put.pubKey;
        }
    });
}

export function getOwnPubKey(gun) {
    return '~' + gun.user().is.pub;
}