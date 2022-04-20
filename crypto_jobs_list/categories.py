import json
import requests
from bs4 import BeautifulSoup

URL = "https://cryptojobslist.com/categories"

resp = requests.get(URL)
soup = BeautifulSoup(resp.content, 'html5lib')

categories = []
for listing in soup.find_all("li"):
    link = listing.find("a").attrs["href"]
    category = link.split("/")[-1]
    if category:
        categories.append(category)

with open("../data/crypto_jobs_list/categories.json", "w") as f:
    json.dump(categories, f, indent=2)
