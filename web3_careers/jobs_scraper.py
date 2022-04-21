from bs4 import BeautifulSoup
import csv
import requests

import time
from glob import glob


class JobScraper:
    def __init__(self):
        self.company_links = {}
        self.base_url = "https://web3.career/"
        with open("../data/web3_careers/web3_careers_company_names.csv", newline="") as file:
            company_name_reader = csv.reader(file)
            next(company_name_reader)

            for row in company_name_reader:
                self.company_links[row[0]] = row[1]

    @staticmethod
    def clean_text(text):
        return text.strip("\n").strip()

    @staticmethod
    def export_data(company_name, job_data):
        with open(f"../data/web3_careers/companies_job_data/{company_name}.csv", "a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["Company Name", "Job Title", "Salary Range", "Tags", "Posted Before"])

            for row in job_data:
                writer.writerow(row)

    @staticmethod
    def export_page_data(page_num, job_data):
        with open(f"../data/web3_careers/page_data/{page_num}.csv", "a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["Company Name", "Job Link", "Job Title", "Salary Range", "Tags", "Posted Before"])

            for row in job_data:
                writer.writerow(row)

    def scrape_company_jobs(self, company_name, link):
        base_link = link
        requested_page_num = 1
        company_job_data = []
        while True:
            link = base_link.rstrip("/") + f"?page={requested_page_num}"

            resp = requests.get(link)
            soup = BeautifulSoup(resp.content, 'html5lib')

            try:
                display_page_num = self.clean_text(soup.find("li", attrs={"class": "page-item active"}).text)
            except:
                display_page_num = "1"

            if display_page_num != str(requested_page_num):
                break

            requested_page_num += 1
            job_rows = soup.find_all("tr", attrs={"class": "table_row"})
            for job_row in job_rows:
                try:
                    data_points = job_row.find_all("td")
                    job_details = data_points[0].find("div").find_all("div")[1]
                    job_title = self.clean_text(job_details.find_all("div")[0].text)
                    salary_range = self.clean_text(job_details.find("p").text)

                    tags = data_points[2].find_all("span")
                    tags = ":".join([self.clean_text(tag.text) for tag in tags])
                    posted_before = self.clean_text(data_points[3].text)

                    company_job_data.append([company_name, job_title, salary_range, tags, posted_before])

                except Exception as exp:
                    print("[ERROR] Job not added")
                    continue

            time.sleep(0.5)

        self.export_data(company_name, company_job_data)

    def scrape_company_jobs_from_main_page(self):
        base_link = self.base_url
        requested_page_num = 1
        while True:
            company_job_data = []
            link = base_link.rstrip("/") + f"?page={requested_page_num}"

            resp = requests.get(link)
            soup = BeautifulSoup(resp.content, 'html5lib')

            try:
                display_page_num = self.clean_text(soup.find("li", attrs={"class": "page-item active"}).text)
            except:
                display_page_num = "1"

            if display_page_num != str(requested_page_num):
                break

            requested_page_num += 1
            job_rows = soup.find_all("tr", attrs={"class": "table_row"})
            for job_row in job_rows:
                try:
                    data_points = job_row.find_all("td")
                    job_details = data_points[0].find("div").find_all("div")[1]
                    job_title = self.clean_text(job_details.find_all("div")[0].text)
                    job_link = "https://web3.career" + job_details.find_all("div")[0].find("a").attrs["href"]
                    company_name = self.clean_text(job_details.find_all("div")[1].text)
                    salary_range = self.clean_text(job_details.find("p").text)

                    tags = data_points[2].find_all("span")
                    tags = ":".join([self.clean_text(tag.text) for tag in tags])
                    posted_before = self.clean_text(data_points[3].text)

                    company_job_data.append([company_name, job_link, job_title, salary_range, tags, posted_before])

                except Exception as exp:
                    print("[ERROR] Job not added")
                    continue

            self.export_page_data(display_page_num, company_job_data)
            time.sleep(0.5)

    def scrape_all(self):
        csv_files = glob("../data/web3_careers/companies_job_data/*.csv")
        completed_companies = set([csv_file.split("/")[-1].split(".csv")[0] for csv_file in csv_files])

        for company_name, link in self.company_links.items():
            if company_name not in completed_companies:
                self.scrape_company_jobs(company_name, link)
                print(f"[Completed] {company_name}")
            else:
                print(f"[Skipped] {company_name}")


job_scraper = JobScraper()
job_scraper.scrape_company_jobs_from_main_page()