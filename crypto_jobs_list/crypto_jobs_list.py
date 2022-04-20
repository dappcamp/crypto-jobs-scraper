import csv
import json
import requests
from datetime import datetime, date

URL = "https://cryptojobslist.com/_next/data/ENjPvOT958q4HHR2GRj2M/en/tags/TAG_GOES_HERE/all.json"

TAGS = json.load(open("data/crypto_jobs_list/categories.json", "r"))
tag_jobs_count = {}
jobs = {}


def export_data(job_data):
    with open(f"data/crypto_jobs_list/all_jobs.csv", "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Company Name", "Job Title", "Tags", "Posted Before"])

        for id in job_data:
            writer.writerow(job_data[id])


for tag in TAGS:
    try:
        resp = requests.get(URL.replace("TAG_GOES_HERE", tag)).json()
        for job in resp["pageProps"]["jobs"]:
            tag_jobs_count[tag] = tag_jobs_count.get(tag, 0) + 1

            published_date = datetime.strptime(job["publishedAt"].split("T")[0], "%Y-%m-%d").date()
            current_date = date.today()

            days = (current_date - published_date).days

            if days < 30:
                time_passed = f"{days}d"
            elif days < 365:
                time_passed = f"{days // 30}m"
            else:
                time_passed = f"{days // 365}y"

            job_details = [
                job["companyName"],
                job["jobTitle"],
                ":".join(job["tags"]),
                time_passed
            ]
            jobs[job["id"]] = job_details

        print(f"[Completed] {tag}")
    except:
        print(f"[Error] {tag}")


export_data(jobs)
