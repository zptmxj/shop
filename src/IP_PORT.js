const serverIP = '168.126.179.44';
//ssconst serverPath = '192.168.10.5';
//const serverPath = 'localhost';
const serverPORT = '3001';
const imagePORT = '3002';

function serverPath(){
    return 'http://'+serverIP+':'+serverPORT;
}

function imagePath(){
    return 'http://'+serverIP+':'+imagePORT;
}

export {serverPath,imagePath};
