const fs = require('fs');
const path = require('path');  

module.exports = {
    getInput: (sub) => {
        try {  
            const filePath = path.join(__dirname, sub);
            var data = fs.readFileSync(filePath, 'utf8');
            return data;
        } catch(e) {
            console.log('Error:', e.stack);
        }
    },
}