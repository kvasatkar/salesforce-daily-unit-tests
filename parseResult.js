const fs = require('fs')

let testResults = JSON.parse(fs.readFileSync('result.json'));
let summary = testResults.result.summary;
let tests = testResults.result.tests;

let slackPayload = {
    text: 'Test Runs Finished',
    blocks: []
}

let hostname = summary.hostname;
const firstPart = summary.hostname.match(/\/\/(.*?)\./);


if (firstPart) {
    hostname = firstPart[1];
}

let summaryText = '';

let codecoverage = '';

if(summary.outcome == 'Failed'){
     summaryText = `❌   Automated unit testing for ${summary.username} (${hostname}) has *${summary.outcome}* with ${summary.testsRan} test runs and ${summary.failing} failure(s)`
     codecoverage = ` The Overall Code Coverage of the (${hostname}) org is ${summary.orgWideCoverage} `   
}
else{
    summaryText = `✅   Automated unit testing for ${summary.username} (${hostname}) has *${summary.outcome}* 🎉 `
    codecoverage = ` The Overall Code Coverage of the (${hostname}) org is ${summary.orgWideCoverage} `   
}


let summaryBlock = {
    type: 'section',
    text: {
        type: 'mrkdwn',
        text: summaryText
    }
}
slackPayload.blocks.push(summaryBlock);

let codecoverageBlock = {
    type: 'section',
    text: {
        type: 'mrkdwn',
        text: codecoverage
    }
}
slackPayload.blocks.push(codecoverageBlock);


for(const test of tests){

    if(test.Outcome == 'Fail'){
        
        let testText = `${test.FullName}: ${test.Message}`;

        let block = {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: '`'+testText+'`'
            }
        }

        slackPayload.blocks.push(block);
    }
}

// Convert the object to a JSON string
const jsonData = JSON.stringify(slackPayload); 

// Write the JSON string to the file
fs.writeFileSync('slackPayload.json', jsonData, 'utf-8');
