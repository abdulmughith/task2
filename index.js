'use strict';

import _ from 'lodash';
import { input } from './input.js';


// helpers

function getDifferenceInSeconds(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / 1000;
}
const detectDuplicationByWindow = (d1, d2, window) => getDifferenceInSeconds(d1, d2) < window;
const sortByTime = (a, b) => new Date(a) - new Date(b);



const window = 20

console.log(findDuplicateTransactions(input, window))


function findDuplicateTransactions(transactions, window) {

    //group by sourceAccount,targetAccount,amount,category
    let grouped = _.groupBy(transactions, (item) => `${item.sourceAccount}${item.targetAccount}${item.amount}${item.category}`)

    // get just the values & discard the keys 
    grouped = Object.values(grouped)

    let result = []
    grouped.forEach(group => {

        //order evey group by time
        let orderGroup = _.orderBy(group, ['time'])

        let resultGroup = []
        let duplicateFound = false

        for (let i = 1; i < orderGroup.length; i++) {

            const prevTrans = orderGroup[i - 1];
            const trans = orderGroup[i];

            if (detectDuplicationByWindow(new Date(prevTrans), new Date(trans)),window) {
                duplicateFound = true
                resultGroup.push(prevTrans)

                //last item in the group and there's a duplicate so need to add it
                if (i == group.length - 1)
                    resultGroup.push(trans)

            } else {
                // in the last iteration the was a duplicate
                if (duplicateFound)
                    resultGroup.push(prevTrans)


                duplicateFound = false
            }
        }
        //if the resultGroup empety don't push it to resut 
        if (resultGroup.length > 0)
            result.push(resultGroup)

    })

    //sort the categories by time 
    result.sort((a, b) => sortByTime(a[0].time, b[0].time))
    return result
}

