from bs4 import BeautifulSoup
import csv
import requests


URL = "https://web3.career/web3-companies/"

# relevant_urls = ["https://web3.career/smart-contract-jobs"
#                  "https://web3.career/solidity-jobs"
#                  "https://web3.career/web3js-jobs"
#                  "https://web3.career/solana-jobs"]

resp = requests.get(URL)
soup = BeautifulSoup(resp.content, 'html5lib')

company_rows = soup.find_all("tr")

data_rows = []
for company_row in company_rows:
    elements = company_row.find_all("td")
    if len(elements) >= 5:
        company_name_elem = elements[2]

        company_link = company_name_elem.find("a").attrs["href"]
        company_link = f"https://web3.career{company_link}"
        company_name = company_name_elem.text.strip("\n")

        number_of_jobs = elements[3].text.strip("\n").strip(" ")

        data_rows.append([company_name, company_link, number_of_jobs])

with open("data/web3_careers_company_names.csv", "a", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Company Name", "Page Link", "Number of Jobs"])

    for row in data_rows:
        writer.writerow(row)
