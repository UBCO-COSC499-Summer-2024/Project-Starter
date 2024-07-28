import { jest } from '@jest/globals';
import { csv2json, json2csv } from 'json-2-csv';

// we need this new logix because we cannot drop all rows then add them because there are forgein keys

// @ts-ignore
function newLogic(newJSON, oldJSON) {
    var snapshot = JSON.parse(JSON.stringify(oldJSON))
    for (const newRow of newJSON) {
        if (!snapshot.map(row => row.id).includes(newRow.id)) {
            // check for create
            snapshot.push(newRow)
            // do coresponding database operation 
        }
        else if (snapshot.map(row => row.id).includes(newRow.id)) {
            // check for update
            snapshot[snapshot.map(row => row.id).indexOf(newRow.id)] = newRow
            // do coresponding database operation 
        }
    }
    //copilot
    for (const oldRow of oldJSON) {
        if (!newJSON.map(row => row.id).includes(oldRow.id)) {
            // check for delete
            snapshot.splice(snapshot.map(row => row.id).indexOf(oldRow.id), 1)
            // do coresponding database operation 
        }
    }
    return snapshot
}


test("create new row in json", async () => {
    const olddata = [{ id: 1, name: "lmao" }]
    const newdata = [{ id: 1, name: "lmao" }, { id: 2, name: "lol" }]
    const updated = newLogic(newdata, olddata)
    expect(updated).toEqual(newdata)
    expect(olddata).not.toEqual(newdata)
})

test("delete a row in json", async () => {
    const olddata = [{ id: 1, name: "lmao" }, { id: 2, name: "lol" }]
    const newdata = [{ id: 1, name: "lmao" }]
    const updated = newLogic(newdata, olddata)
    expect(updated).toEqual(newdata)
    expect(olddata).not.toEqual(newdata)
})

test("edit a row in json", async () => {
    const olddata = [{ id: 1, name: "lmao" }, { id: 2, name: "lol" }]
    const newdata = [{ id: 1, name: "lmao" }, { id: 2, name: "rogl" }]
    const updated = newLogic(newdata, olddata)
    expect(updated).toEqual(newdata)
    expect(olddata).not.toEqual(newdata)
})

test("No change", async () => {
    const olddata = [{ id: 1, name: "lmao" }, { id: 2, name: "lol" }]
    const newdata = [{ id: 1, name: "lmao" }, { id: 2, name: "lol" }]
    const updated = newLogic(newdata, olddata)
    expect(updated).toEqual(newdata)
})


test("Mixture", async () => {
    const olddata = [{ id: 1, name: "lmao" }, { id: 2, name: "lmao" }, {id:3, name:"hehe"}]
    const newdata = [{ id: 1, name: "lmao" }, { id: 2, name: "lol" }, {id:5, name:"omg"}]
    const updated = newLogic(newdata, olddata)
    expect(updated).toEqual(newdata)
    expect(olddata).not.toEqual(newdata)
})