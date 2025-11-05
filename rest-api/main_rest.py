from app import app
from flask import jsonify, flash, request, session, send_file, abort, current_app
from supabase import create_client, Client

SUPABASE_URL = 'https://czqyykcerlzhmrsfdfmq.supabase.co';
SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cXl5a2Nlcmx6aG1yc2ZkZm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDg5NjgsImV4cCI6MjA3NTc4NDk2OH0.2QOLg_5_gHsHlEkLjgFmLoxfQGeHK4Iuo13am5qZB3Y'

@app.route('/approve', methods=['POST'])
def approve():
    try:
        
        data = request.get_json()
        pid = data.get('id')

      
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
        colleges = supabase.table("st_college").select("*").eq("id", pid).execute().data
        college_id_map = {}
        print(colleges)
        for c in colleges:
            name = c["name"].strip()
            print(name)
            record = {"name": name, "description":c["description"].strip(), "address":c["address"].strip() , "city":c["city"].strip(), "state":c["state"].strip(), "zip_code":c["zip_code"].strip(), "website": c["website"].strip(), "email":c["email"].strip(), "phone": c["phone"].strip(), "scholarshipdetails": c["scholarshipdetails"].strip(), "rating": c["rating"] ,"type": c["type"]}

            res = supabase.table("college").upsert(record, on_conflict="name").execute()
            new_id = res.data[0]["id"]
            prod_college_id = new_id
            print("college id", prod_college_id)
            st_college_courses = (
                supabase.table("st_college_course_jobs")
                .select("course_id, job_id")
                .eq("college_id", pid)
               .execute()
              .data
             )
            print("Mapping", st_college_courses)
            for mapping in st_college_courses:
                course_id = mapping["course_id"]
                prod_job_id= mapping['job_id']
                # Fetch the course details from staging
                st_course = (
                  supabase.table("st_course")
                 .select("*")
                 .eq("id", course_id)
                 .single()
                 .execute()
                 .data
               )
                if not st_course:
                    return 

                # Upsert into production course table
                res_course=supabase.table("course").insert(
                {
                 "name": st_course["name"],
                 "description":st_course["description"],
                 "duration": st_course.get("duration"),
                 "degree_level": st_course.get("level"),
                 "seats": st_course.get("seats"),
                 "annual_fees": st_course.get("annual_fees")

       		}
    		).execute()
                prod_course_id=res_course.data[0]["id"]
                print("course id", prod_course_id)
               # Step 5: Create mapping (college_course)
                if prod_course_id:
                    supabase.table("college_course_jobs").insert(
                    {
                  "college_id": prod_college_id,
                   "course_id": prod_course_id,
                    "job_id": prod_job_id
                 }
                ).execute()
                print("Done", st_course["name"])

            return jsonify({"success": success}), 200
    except Exception as e:
        print("Exception", e)
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(port=5000, host='127.0.0.1')