const crypto = require('crypto');
const salt = 'simplesalt~!Q@@#^78Bd0';
module.exports  = str =>  crypto.createHash('SHA256').update(str+salt).digest('base64');