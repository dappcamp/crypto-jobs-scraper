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

const jobBoards = [

    {
        "name": "1517 Fund",
        "url": "https://consider.com/boards/vc/1517-fund/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "1517-fund"
    },
    {
        "name": "5AM Ventures",
        "url": "https://consider.com/boards/vc/5am-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "5am-ventures"
    },
    {
        "name": "645 Ventures",
        "url": "https://consider.com/boards/vc/645-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "645-ventures"
    },
    {
        "name": "AI Fund",
        "url": "https://consider.com/boards/vc/ai-fund/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "ai-fund"
    },
    {
        "name": "AIX Ventures",
        "url": "https://consider.com/boards/vc/aix-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "aix-ventures"
    },
    {
        "name": "Advent International",
        "url": "https://consider.com/boards/vc/advent-international/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "advent-international"
    },
    {
        "name": "AirTree",
        "url": "https://consider.com/boards/vc/airtree/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "airtree"
    },
    {
        "name": "Amplify LA",
        "url": "https://consider.com/boards/vc/amplify-la/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "amplify-la"
    },
    {
        "name": "Amplify Partners",
        "url": "https://consider.com/boards/vc/amplify-partners/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "amplify-partners"
    },
    {
        "name": "Andreessen Horowitz",
        "url": "https://consider.com/boards/vc/andreessen-horowitz/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "andreessen-horowitz"
    },
    {
        "name": "Anthemis Group",
        "url": "https://consider.com/boards/vc/anthemis-group/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "anthemis-group"
    },
    {
        "name": "Antler",
        "url": "https://consider.com/boards/vc/antler/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "antler"
    },
    {
        "name": "Archetype",
        "url": "https://consider.com/boards/vc/archetype/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "archetype"
    },
    {
        "name": "At One Ventures",
        "url": "https://consider.com/boards/vc/at-one-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "at-one-ventures"
    },
    {
        "name": "Bain Capital",
        "url": "https://consider.com/boards/vc/bain-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "bain-capital"
    },
    {
        "name": "Bain Capital Private Equity",
        "url": "https://consider.com/boards/vc/bain-pe/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "bain-pe"
    },
    {
        "name": "Bain Capital Tech Opportunities",
        "url": "https://consider.com/boards/vc/bain-techopps/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "bain-techopps"
    },
    {
        "name": "Bain Capital Ventures",
        "url": "https://consider.com/boards/vc/bain-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "bain-ventures"
    },
    {
        "name": "Balderton Capital",
        "url": "https://consider.com/boards/vc/balderton-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "balderton-capital"
    },
    {
        "name": "Battery Ventures",
        "url": "https://consider.com/boards/vc/battery-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "battery-ventures"
    },
    {
        "name": "Bessemer Ventures",
        "url": "https://consider.com/boards/vc/bessemer-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "bessemer-ventures"
    },
    {
        "name": "Blossom Street Ventures",
        "url": "https://consider.com/boards/vc/blossom-street-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "blossom-street-ventures"
    },
    {
        "name": "Bread and Butter Ventures",
        "url": "https://consider.com/boards/vc/bread-and-butter-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "bread-and-butter-ventures"
    },
    {
        "name": "CapitalG",
        "url": "https://consider.com/boards/vc/capitalg/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "capitalg"
    },
    {
        "name": "Cherry Ventures",
        "url": "https://consider.com/boards/vc/cherry-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "cherry-ventures"
    },
    {
        "name": "Chinaccelerator",
        "url": "https://consider.com/boards/vc/chinaccelerator/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "chinaccelerator"
    },
    {
        "name": "Costanoa",
        "url": "https://consider.com/boards/vc/costanoa-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "costanoa-ventures"
    },
    {
        "name": "Cultivation Capital",
        "url": "https://consider.com/boards/vc/cultivation-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "cultivation-capital"
    },
    {
        "name": "Decibel Partners",
        "url": "https://consider.com/boards/vc/decibel-partners/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "decibel-partners"
    },
    {
        "name": "EquityPitcher",
        "url": "https://consider.com/boards/vc/equitypitcher/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "equitypitcher"
    },
    {
        "name": "Ethereal Ventures",
        "url": "https://consider.com/boards/vc/ethereal-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "ethereal-ventures"
    },
    {
        "name": "Eurazeo",
        "url": "https://consider.com/boards/vc/eurazeo/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "eurazeo"
    },
    {
        "name": "Expa",
        "url": "https://consider.com/boards/vc/expa/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "expa"
    },
    {
        "name": "FAST",
        "url": "https://consider.com/boards/vc/fast/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "fast"
    },
    {
        "name": "Fenbushi Capital",
        "url": "https://consider.com/boards/vc/fenbushi-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "fenbushi-capital"
    },
    {
        "name": "Fifty Years",
        "url": "https://consider.com/boards/vc/fifty-years/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "fifty-years"
    },
    {
        "name": "Fika Ventures",
        "url": "https://consider.com/boards/vc/fika-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "fika-ventures"
    },
    {
        "name": "First Round Capital",
        "url": "https://consider.com/boards/vc/first-round-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "first-round-capital"
    },
    {
        "name": "Foothill Ventures",
        "url": "https://consider.com/boards/vc/tsingyuan-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "tsingyuan-ventures"
    },
    {
        "name": "Forerunner Ventures",
        "url": "https://consider.com/boards/vc/forerunner-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "forerunner-ventures"
    },
    {
        "name": "Foresite Labs",
        "url": "https://consider.com/boards/vc/foresite-labs/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "foresite-labs"
    },
    {
        "name": "Goodwater Capital",
        "url": "https://consider.com/boards/vc/goodwater-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "goodwater-capital"
    },
    {
        "name": "Grow Fast Ventures",
        "url": "https://consider.com/boards/vc/grow-fast/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "grow-fast"
    },
    {
        "name": "HAX",
        "url": "https://consider.com/boards/vc/hax/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "hax"
    },
    {
        "name": "High Alpha",
        "url": "https://consider.com/boards/vc/high-alpha/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "high-alpha"
    },
    {
        "name": "Illuminate Financial",
        "url": "https://consider.com/boards/vc/illuminate-financial/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "illuminate-financial"
    },
    {
        "name": "In/Visible Ventures",
        "url": "https://consider.com/boards/vc/invisible-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "invisible-ventures"
    },
    {
        "name": "IndieBio",
        "url": "https://consider.com/boards/vc/indiebio/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "indiebio"
    },
    {
        "name": "Ingressive Capital",
        "url": "https://consider.com/boards/vc/ingressive-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "ingressive-capital"
    },
    {
        "name": "JVP",
        "url": "https://consider.com/boards/vc/jvp/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "jvp"
    },
    {
        "name": "Kleiner Perkins",
        "url": "https://consider.com/boards/vc/kleiner-perkins/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "kleiner-perkins"
    },
    {
        "name": "Lightspeed Venture Partners",
        "url": "https://consider.com/boards/vc/lightspeed/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "lightspeed"
    },
    {
        "name": "Lofty Ventures",
        "url": "https://consider.com/boards/vc/lofty-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "lofty-ventures"
    },
    {
        "name": "MOX",
        "url": "https://consider.com/boards/vc/mox/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "mox"
    },
    {
        "name": "Makers Fund",
        "url": "https://consider.com/boards/vc/makers-fund/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "makers-fund"
    },
    {
        "name": "Newfund",
        "url": "https://consider.com/boards/vc/newfund/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "newfund"
    },
    {
        "name": "Nexus Venture Partners",
        "url": "https://consider.com/boards/vc/nexus-venture-partners/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "nexus-venture-partners"
    },
    {
        "name": "Notation Capital",
        "url": "https://consider.com/boards/vc/notation-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "notation-capital"
    },
    {
        "name": "One Peak",
        "url": "https://consider.com/boards/vc/one-peak/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "one-peak"
    },
    {
        "name": "OneRagtime",
        "url": "https://consider.com/boards/vc/oneragtime/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "oneragtime"
    },
    {
        "name": "Oregon Venture Fund",
        "url": "https://consider.com/boards/vc/oregon-venture-fund/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "oregon-venture-fund"
    },
    {
        "name": "Panoramic Ventures",
        "url": "https://consider.com/boards/vc/panoramic-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "panoramic-ventures"
    },
    {
        "name": "Peterson Partners",
        "url": "https://consider.com/boards/vc/peterson-partners/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "peterson-partners"
    },
    {
        "name": "Playground",
        "url": "https://consider.com/boards/vc/playground-global/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "playground-global"
    },
    {
        "name": "Propel Venture Partners",
        "url": "https://consider.com/boards/vc/propel-venture-partners/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "propel-venture-partners"
    },
    {
        "name": "QED Investors",
        "url": "https://consider.com/boards/vc/qed-investors/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "qed-investors"
    },
    {
        "name": "Renegade Partners",
        "url": "https://consider.com/boards/vc/renegade-partners/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "renegade-partners"
    },
    {
        "name": "SOSV",
        "url": "https://consider.com/boards/vc/sosv/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "sosv"
    },
    {
        "name": "Scribble",
        "url": "https://consider.com/boards/vc/scribble/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "scribble"
    },
    {
        "name": "Sequoia Capital",
        "url": "https://consider.com/boards/vc/sequoia-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "sequoia-capital"
    },
    {
        "name": "Sequoia Capital India",
        "url": "https://consider.com/boards/vc/sequoia-capital-india/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "sequoia-capital-india"
    },
    {
        "name": "Seventy Seven",
        "url": "https://consider.com/boards/vc/seventy-seven/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "seventy-seven"
    },
    {
        "name": "Shore CP",
        "url": "https://consider.com/boards/vc/shore-cp/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "shore-cp"
    },
    {
        "name": "Sterling Partners",
        "url": "https://consider.com/boards/vc/sterling-partners/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "sterling-partners"
    },
    {
        "name": "Stratos",
        "url": "https://consider.com/boards/vc/stratos/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "stratos"
    },
    {
        "name": "Surge",
        "url": "https://consider.com/boards/vc/surge-ahead/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "surge-ahead"
    },
    {
        "name": "TCG",
        "url": "https://consider.com/boards/vc/tcg/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "tcg"
    },
    {
        "name": "TenOneTen Ventures",
        "url": "https://consider.com/boards/vc/tenoneten-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "tenoneten-ventures"
    },
    {
        "name": "Union Square Ventures",
        "url": "https://consider.com/boards/vc/union-square-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "union-square-ventures"
    },
    {
        "name": "Wing Venture Capital",
        "url": "https://consider.com/boards/vc/wing-venture-capital/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "wing-venture-capital"
    },
    {
        "name": "Wingman",
        "url": "https://consider.com/boards/vc/wingman/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "wingman"
    },
    {
        "name": "WndrCo",
        "url": "https://consider.com/boards/vc/wndrco/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "wndrco"
    },
    {
        "name": "Worklife Ventures",
        "url": "https://consider.com/boards/vc/worklife-ventures/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "worklife-ventures"
    },
    {
        "name": "XAnge",
        "url": "https://consider.com/boards/vc/xange/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "xange"
    },
    {
        "name": "dlab",
        "url": "https://consider.com/boards/vc/dlab/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "dlab"
    },
    {
        "name": "gumi Cryptos Capital",
        "url": "https://consider.com/boards/vc/gumi-cryptos/jobs?markets=Blockchain&markets=Crypto",
        "considerJobBoardId": "gumi-cryptos"
    }
]


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
    for (const jobBoard of jobBoards) {
        let { name, url, considerJobBoardId } = jobBoard
        const vcName = name
        const urlPlusId = { url, considerJobBoardId }
        // console.log(vcName, urlPlusId)
        const totalJobs = await scrapeJobBoard(vcName, urlPlusId)
        stats[vcName] = {
            totalJobs,
            ...urlPlusId
        }
    }
    fs.writeFileSync(`./data/stats/${serviceName}_stats.json`, JSON.stringify(stats, null, 3));
}

main()