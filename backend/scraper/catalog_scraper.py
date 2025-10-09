import time
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import re

# Hunter Computer Science Catalog URL
URL = "https://hunter-undergraduate.catalog.cuny.edu/departments/CSCI-HTR/courses"

def main():
        # Set up Selenium
        opts = webdriver.ChromeOptions()
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)

        # Load the department page and let Vue render
        driver.get(URL)
        time.sleep(3)
        html = driver.page_source
        driver.quit()

        # Parse the HTML
        soup = BeautifulSoup(html, "lxml")

        rows = []
        for tr in soup.select("table.ui-font tbody tr"):
                tds = tr.find_all("td")
                if len(tds) < 2:
                        continue

                code  = " ".join(tds[0].stripped_strings)
                title = " ".join(tds[1].stripped_strings)

                # Extract course ID from the code cell's link (e.g., /courses/0168621)
                course_id = None
                a = tds[0].find("a", href=True)
                if a:
                        m = re.search(r"/courses/(\d+)", a["href"])
                        if m:
                                course_id = m.group(1)

                rows.append({
                        "code": code,
                        "title": title,
                        "course_id": course_id,  # may be None if no link found
                })

        # Save to CSV
        df = pd.DataFrame(rows, dtype=str)
        df.to_csv("hunter_csci_courses.csv", index=False)
        print("Saved", len(df), "courses to hunter_csci_courses.csv")

if __name__ == "__main__":
        main()