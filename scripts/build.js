import * as fs from "node:fs";
import * as path from "node:path";
import yaml from "js-yaml";
import mikel from "mikel";

// get formatted updated date
const getUpdatedDate = () => {
    const now = new Date();
    // Use Intl.DateFileFormat to generate build time
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
    const dateTimeOptions = {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "CET",
    };
    // Return build info
    return new Intl.DateTimeFormat("en-US", dateTimeOptions).format(now);
};

// get build data
const getData = () => {
    const dataPath = path.join(process.cwd(), "data.yml");
    const data = {
        updated_at: getUpdatedDate(),
    };
    // 1. check if resume data has been provided via env variable
    if (!!process.env.RESUME_DATA) {
        Object.assign(data, yaml.load(process.env.RESUME_DATA));
    }
    // 2. check if we have a data.yml file
    else if (fs.existsSync(dataPath)) {
        Object.assign(data, yaml.load(fs.readFileSync(dataPath, "utf8")));
    }
    //return parsed data
    return data;
};

// build site
const data = getData();
const template = fs.readFileSync(path.join(process.cwd(), "template.html"), "utf8");
const content = mikel(template, data, {});
fs.writeFileSync(path.join(process.cwd(), "www/index.html"), content, "utf8");
fs.writeFileSync(path.join(process.cwd(), "www/api.json"), JSON.stringify(data), "utf8");
