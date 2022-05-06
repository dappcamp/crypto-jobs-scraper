const axios = require('axios')
const crypto = require('crypto')
const jsdom = require("jsdom");
const fs = require('fs')
const { JSDOM } = jsdom;

const json2csv = require("json2csv")
const Parser = json2csv.Parser

const links = [
    "https://www.linkedin.com/jobs/search/?f_C=33295408&geoId=92000000",
    "https://www.linkedin.com/jobs/search/?f_C=19010577&geoId=92000000",
    "https://www.linkedin.com/jobs/search/?f_C=76942089&geoId=92000000",
    "https://www.linkedin.com/jobs/search/?f_C=5358401&geoId=92000000",
    "https://www.linkedin.com/jobs/search/?f_C=9273983&geoId=92000000",
    "https://www.linkedin.com/jobs/search/?f_C=7598359&geoId=92000000",
    "https://www.linkedin.com/jobs/search/?f_C=13623668&geoId=92000000",
    "https://www.linkedin.com/jobs/search/?f_C=3839986&geoId=92000000",
]

const serviceName = "linkedin"

const scrapeLink = async (link) => {
    const response = await axios.get(link)
    const dom = new JSDOM(response.data);

    const jobs = [...dom.window.document.querySelectorAll(".job-search-card")].map(el => {
        return {
            'Company Name': el.querySelector(".base-search-card__subtitle").textContent.trim(),
            'Job Link': el.querySelector(".base-card__full-link").getAttribute("href"),
            'Job Title': el.querySelector(".base-search-card__title").textContent.trim(),
            'Job Location': el.querySelector(".job-search-card__location").textContent.trim(),
            'Posted Before': el.querySelector(".job-search-card__listdate") ? el.querySelector(".job-search-card__listdate").getAttribute("datetime") : "",
            'Source URL': link,
            "Source Name": "LinkedIn"
        }
    })

    const companyName = jobs[0]?.['Company Name'] ? jobs[0]?.['Company Name'].replace(" ", "-") : crypto.createHash('sha256').update(link, 'utf8').digest('hex')

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(jobs);

    const fileName = `./data/${serviceName}/${companyName}.csv`
    fs.writeFileSync(fileName, csv);

    console.log("Scraped", jobs.length, "jobs from", link, "for company", companyName)
    await new Promise(r => setTimeout(r, 5000));
}

const main = async () => {
    for (const link of links) {
        await scrapeLink(link)
    }
}

main()