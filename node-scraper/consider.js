const fs = require('fs')
const axios = require('axios');

const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en.json')

const json2csv = require("json2csv")
const Parser = json2csv.Parser

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const pageSize = 250
const serviceName = "consider"

const jobBoards = {
    "Andreessen Horowitz": {
        url: "https://consider.com/boards/vc/andreessen-horowitz/jobs?markets=Blockchain&markets=Crypto",
        considerJobBoardId: "andreessen-horowitz"
    },
    "Sequoia Capital": {
        url: "https://consider.com/boards/vc/sequoia-capital/jobs?markets=Blockchain&markets=Crypto",
        considerJobBoardId: "sequoia-capital"
    },
    "Stratos": {
        url: "https://consider.com/boards/vc/stratos/jobs?markets=Blockchain&markets=Crypto",
        considerJobBoardId: "stratos"
    },
}

const generateConfig = (id, pageNo) =>
    JSON.stringify({
        "meta": {
            "size": pageSize,
            "sequence": pageNo * pageSize
        },
        "board": {
            "id": id,
            "isParent": true
        },
        "query": {
            "remoteOnly": false,
            "internshipOnly": false,
            "managerOnly": false,
            "bestFit": false,
            "markets": [
                "Blockchain",
                "Crypto"
            ]
        }
    })

const scrapeJobBoard = async (sourceName, { url, considerJobBoardId }) => {
    let pageNo = 0

    while (true) {
        const requestConfig = {
            method: 'post',
            url: 'https://consider.com/api-boards/search-jobs',
            headers: {
                'authority': 'consider.com',
                'accept': 'application/json',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/json',
                'origin': 'https://consider.com',
                'referer': 'https://consider.com/boards/vc/andreessen-horowitz/jobs?markets=Blockchain&markets=Crypto',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
            },
            data: generateConfig(considerJobBoardId, pageNo)
        }
        const response = await axios(requestConfig)
        pageNo = pageNo + 1

        let jobs = []

        const responseJobs = response.data.jobs
        if (responseJobs.length === 0) {
            return response.data.total
        }

        responseJobs.forEach(async (job) => {
            const companyName = job?.companyName || ""
            const jobLink = job?.url || ""
            const jobLocation = job?.locations && job?.locations.length > 0 && job?.locations[0] || ""
            const jobTitle = job?.title || ""

            const skills = job?.skills || []
            const tags = skills.map(item => item.label).join(":")

            const timeStamp = job?.timeStamp
            const jobId = job?.jobId

            const parsedJob = {
                "Company Name": companyName,
                "Job Link": jobLink,
                "Job Location": jobLocation,
                "Job Title": jobTitle,
                "Salary Range": "",
                "Tags": tags,
                "Posted Before": timeAgo.format(new Date(timeStamp), 'mini'),
                "Source URL": url,
                "Source Name": sourceName,
                "Consider JobID": jobId
            }
            jobs.push(parsedJob);
        })

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(jobs);

        const fileName = `./data/${serviceName}/${sourceName.replace(" ", "-")}_${pageNo}.csv`

        fs.writeFileSync(fileName, csv);
        console.log(`Scraped ${responseJobs.length} jobs from ${sourceName} Page ${pageNo}`)
    }
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