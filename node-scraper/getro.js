const fs = require('fs')
const axios = require('axios');

const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en.json')

const json2csv = require("json2csv")
const Parser = json2csv.Parser

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const pageSize = 250
const serviceName = "getro"

const jobBoards = {
    "Digital Currency Group": {
        url: "https://jobs.dcg.co/jobs",
        getroIndexName: "Job_116_production"
    },
    "Blockchain Capital": {
        url: "https://jobs.blockchaincapital.com/jobs",
        getroIndexName: "Job_815_production"
    },
    "Pantera Capital": {
        url: "https://jobs.panteracapital.com/jobs",
        getroIndexName: "Job_337_production"
    },
    "Polychain Capital": {
        url: "https://jobs.polychain.capital/jobs",
        getroIndexName: "Job_203_production"
    },
    "Paradigm Research": {
        url: "https://jobs.paradigm.xyz/jobs",
        getroIndexName: "Job_944_production"
    },
    "Dragon Fly Capital": {
        url: "https://jobs.dcp.capital/jobs",
        getroIndexName: "Job_1118_production"
    },
    "Multicoin Capital": {
        url: "https://jobs.multicoin.capital/jobs",
        getroIndexName: "Job_390_production"
    },
    "Framework Ventures": {
        url: "https://jobs.framework.ventures/jobs",
        getroIndexName: "Job_1127_production"
    }
}

const generateConfig = (indexName, pageNo) =>
    JSON.stringify({
        "requests": [
            {
                "indexName": indexName,
                "params": `page=${pageNo}&hitsPerPage=${pageSize}&filters=&attributesToRetrieve=%5B%22title%22%2C%22organization.name%22%2C%22organization.logo_url%22%2C%22organization.slug%22%2C%22organization.id%22%2C%22locations%22%2C%22url%22%2C%22created_at%22%2C%22slug%22%2C%22source%22%5D&removeStopWords=%5B%22en%22%5D&query=`
            }
        ]
    });

const scrapeJobBoard = async (sourceName, { url, getroIndexName }) => {
    const requestConfig = {
        method: 'post',
        url: 'https://su5v69fjoj-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia for JavaScript (4.12.1); Browser',
        headers: {
            'x-algolia-api-key': 'a4971670ebc5d269725bb3d7639f9c3d',
            'x-algolia-application-id': 'SU5V69FJOJ',
            'Content-Type': 'application/json'
        },
        data: generateConfig(getroIndexName, 0)
    };
    const response = await axios(requestConfig)

    const totalPages = response.data.results[0].nbPages

    for (let i = 0; i < totalPages; i++) {
        const requestConfig = {
            method: 'post',
            url: 'https://su5v69fjoj-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia for JavaScript (4.12.1); Browser',
            headers: {
                'x-algolia-api-key': 'a4971670ebc5d269725bb3d7639f9c3d',
                'x-algolia-application-id': 'SU5V69FJOJ',
                'Content-Type': 'application/json'
            },
            data: generateConfig(getroIndexName, i)
        }
        const response = await axios(requestConfig)

        let jobs = []
        response.data.results[0].hits.forEach(async (job) => {
            const companyName = job?.organization?.name || ""
            const jobLink = job?.url || ""
            const jobLocation = job?.locations && job?.locations.length > 0 && job?.locations[0] || ""

            const jobFunctions = job?._highlightResult?.job_functions || []
            const topics = job?._highlightResult?.organization?.topics || []
            const tags = [...jobFunctions, ...topics].map(item => item.value).join(":")

            const createdAt = job?.created_at
            const objectID = job?.objectID

            const parsedJob = {
                "Company Name": companyName,
                "Job Link": jobLink,
                "Job Location": jobLocation,
                "Job Title": job?.title || "",
                "Salary Range": "",
                "Tags": tags,
                "Posted Before": timeAgo.format(createdAt * 1000, 'mini'),
                "Source URL": url,
                "Source Name": sourceName,
                "Getro ObjectID": objectID
            }
            jobs.push(parsedJob);
        })

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(jobs);

        const fileName = `./data/${serviceName}/${sourceName.replace(" ", "-")}_${i}.csv`

        fs.writeFileSync(fileName, csv);
        console.log(`Scraped ${response.data.results[0].hits.length} jobs from ${sourceName} Page ${i}`)

        await new Promise(r => setTimeout(r, 2500));
    }

    return response.data.results[0].nbHits
}

const main = async () => {
    let stats = {}
    for (let [vcName, urlAndGetroIndex] of Object.entries(jobBoards)) {
        const totalJobs = await scrapeJobBoard(vcName, urlAndGetroIndex)
        stats[vcName] = {
            totalJobs,
            ...urlAndGetroIndex
        }
    }
    fs.writeFileSync(`./data/stats/${serviceName}_stats.json`, JSON.stringify(stats, null, 3));
}

main()