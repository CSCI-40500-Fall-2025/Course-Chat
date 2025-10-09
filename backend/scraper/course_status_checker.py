import pandas as pd
import requests
import time

TERM_ID = "1259"  # Fall Semester 2025
TENANT = "ca/htr01"

heads = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://hunter-undergraduate.catalog.cuny.edu/",
}

def build_section_url(course_id: str) -> str:
        return (
                f"https://app.coursedog.com/api/v1/{TENANT}/sections/{TERM_ID}/{course_id}"
                "?includeRelatedData=true"
                "&returnFields=callNumber,sectionNumber,days,times,dates,"
                "instructionMode,enrollment,maxEnrollment,startDate,endDate"
        )

def fetch_sections(course_id, delay=0.3):
        url = build_section_url(course_id)
        r = requests.get(url, headers=heads)

        # Handle rate limits gracefully
        if r.status_code == 429:
                print("Rate limited — waiting 2 seconds...")
                time.sleep(2)
                r = requests.get(url, headers=heads)

        r.raise_for_status()
        data = r.json()

        # polite delay between requests
        time.sleep(delay)

        return data.get("sections", [])

def main():
        # 1. Read the CSV file
        df = pd.read_csv("hunter_csci_courses.csv", dtype={"course_id": str})

        # 2. Add a new column to hold status
        df["status"] = ""  # initialize empty column

        # 3. Loop through each course
        for i, row in df.iterrows():
                course_id = row["course_id"]
                # code = row["code"]

                if not course_id or course_id == "nan":
                        df.at[i, "status"] = "Invalid ID"
                        continue

                try:
                        sections = fetch_sections(course_id)
                        status = "Available" if sections else "No sections"
                        df.at[i, "status"] = status
                        # print(f"[{i+1}/{len(df)}] {code} → {status}")
                except Exception as e:
                        df.at[i, "status"] = f"Error: {type(e).__name__}"
                        # print(f"[{i+1}/{len(df)}] {code} → ERROR ({type(e).__name__})")

        # 4. Overwrite the same CSV
        df.to_csv("hunter_csci_courses.csv", index=False)
        print("\nDone. Updated 'hunter_csci_courses.csv' with status column.")


if __name__ == "__main__":
    main()
